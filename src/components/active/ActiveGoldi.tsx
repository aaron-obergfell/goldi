import { useState, useEffect } from 'react';
import { appDataRepository, Project } from '../../db/appData';
import { GoldiData, GoldiJSON } from '../../types/goldi';
import GoldiView from './view/GoldiView';
import { onBeforeUnload } from '../../window/onbeforeunload';
import { getFileHandleFromSavePicker, getWritable } from '../../fs/fileHandleHelper';
import { projectDataRepository } from '../../db/projectData';
import GoldiEdit from './edit/GoldiEdit';
import NavBarForActiveGoldi from './NavBarForActiveGoldi';
import { Container } from 'react-bootstrap';
import { useLiveQuery } from 'dexie-react-hooks';
import { getCheckSum } from '../../logic/projects/projectService'

type ActiveGoldiProps = {
  projectId: string;
  onClose: () => void;
}

export enum GoldiMode {
  View,
  Edit
}

export default function ActiveGoldi(props: ActiveGoldiProps) {

  const project: undefined | Project = useLiveQuery(() => appDataRepository.projects.get(props.projectId));
  const [goldiMode, setGoldiMode] = useState<GoldiMode>(GoldiMode.View);
  const [saveNeeded, toggleSaveNeeded] = useState<boolean>(false);

  useEffect(() => {
    // loadFile(props.projectId);
  }, [props.projectId]);

  useEffect(() => {
    if (project && project.meta) document.title = project.meta.title;
    window.removeEventListener('beforeunload', onBeforeUnload, true);
    if (saveNeeded) {
      console.warn("Unsafed changes are  present.");
      window.addEventListener('beforeunload', onBeforeUnload, true);
    }
  });

  return (
    <Container fluid>
      <NavBarForActiveGoldi
        saveNeeded={saveNeeded}
        projectId={props.projectId}
        onClose={props.onClose}
        setGoldiMode={setGoldiMode}
        save={save}
      />
      {(project && project.meta && (goldiMode === GoldiMode.View)) &&
        <GoldiView projectId={props.projectId} goldiMeta={project.meta}></GoldiView>
      }
      {(project && (goldiMode === GoldiMode.Edit)) &&
        <GoldiEdit project={project} />
      }
    </Container>
  );

  async function save(id: string): Promise<void> {
    const project = await appDataRepository.projects.get(id);
    if (project && project.meta && project.fileHandle) {
      const fileHandle = project.fileHandle;
      const writable = await getWritable(fileHandle);
      const db = projectDataRepository(props.projectId);
      const goldiData: GoldiData = {
        columns: await db.columns.toArray(),
        values: await db.values.toArray(),
        items: await db.items.toArray(),
        images: await db.images.toArray(),
        itemToImageMappings: await db.itemToImageMappings.toArray(),
        itemToValueMappings: await db.itemToValueMappings.toArray(),
        itemToValueAssignments: await db.itemToValueAssignments.toArray()
      }
      const goldiJson: GoldiJSON = { meta: project.meta, data: goldiData }
      await writable.write(JSON.stringify(goldiJson, null, 2));
      // Close the file and write the contents to disk.
      await writable.close();
      toggleSaveNeeded(false);
      let newCheckSum = await getCheckSum(await fileHandle.getFile());
      await appDataRepository.projects.update(id, { checkSum: newCheckSum });
    } else if (project && project.meta) {
      let fileHandle: FileSystemFileHandle = await getFileHandleFromSavePicker();
      appDataRepository.projects.update(id, { "fileHandle": fileHandle });
      const writable = await getWritable(fileHandle);
      const db = projectDataRepository(props.projectId);
      const goldiData: GoldiData = {
        columns: await db.columns.toArray(),
        values: await db.values.toArray(),
        items: await db.items.toArray(),
        images: await db.images.toArray(),
        itemToImageMappings: await db.itemToImageMappings.toArray(),
        itemToValueMappings: await db.itemToValueMappings.toArray(),
        itemToValueAssignments: await db.itemToValueAssignments.toArray()
      }
      const goldiJson: GoldiJSON = { meta: project.meta, data: goldiData }
      await writable.write(JSON.stringify(goldiJson, null, 2));
      // Close the file and write the contents to disk.
      await writable.close();
      toggleSaveNeeded(false);
      let newCheckSum = await getCheckSum(await fileHandle.getFile());
      await appDataRepository.projects.update(id, { checkSum: newCheckSum });
    } else {
      alert("Fehler")
    }
  }
}