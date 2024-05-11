import { useState, useEffect } from 'react';
import { appDataRepository } from '../../db/appData';
import { defaultMeta, GoldiData, GoldiJSON, GoldiMeta } from '../../types/goldi';
import GoldiView from './view/GoldiView';
import { onBeforeUnload } from '../../window/onbeforeunload';
import { getFileHandleFromSavePicker, getWritable } from '../../fs/fileHandleHelper';
import { projectDataRepository } from '../../db/projectData';
import GoldiEdit from './edit/GoldiEdit';
import NavBarForActiveGoldi from './NavBarForActiveGoldi';
import { Container } from 'react-bootstrap';

type ActiveGoldiProps = {
  projectId: string;
  onClose: () => void;
}

export enum GoldiMode {
  View,
  Edit
}

export default function ActiveGoldi(props: ActiveGoldiProps) {

  const [goldiMeta, setGoldiMeta] = useState<GoldiMeta | undefined>(undefined);
  const [goldiMode, setGoldiMode] = useState<GoldiMode>(GoldiMode.View);
  const [saveNeeded, toggleSaveNeeded] = useState<boolean>(false);

  useEffect(() => {
    loadFile(props.projectId);
  }, [props.projectId]);

  useEffect(() => {
    if (goldiMeta) document.title = goldiMeta.title;
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
        loadFile={loadFile}
        save={save}
      />
      {(goldiMeta && (goldiMode === GoldiMode.View)) &&
        <GoldiView projectId={props.projectId} goldiMeta={goldiMeta}></GoldiView>
      }
      {(goldiMeta && (goldiMode === GoldiMode.Edit)) &&
        <GoldiEdit />
      }
    </Container>
  );

  async function loadFile(id: string): Promise<void> {
    projectDataRepository(id).delete().then(async () => {
      const project = await appDataRepository.projects.get(id);
      if (project && project.fileHandle) {
        let file = await project.fileHandle.getFile();
        let goldiJson: GoldiJSON = JSON.parse(await file.text());
        setGoldiMeta(goldiJson.meta);
        const db = projectDataRepository(id);
        db.columns.bulkAdd(goldiJson.data.columns);
        db.values.bulkAdd(goldiJson.data.values);
        db.items.bulkAdd(goldiJson.data.items);
        db.images.bulkAdd(goldiJson.data.images);
        db.itemToImageMappings.bulkAdd(goldiJson.data.itemToImageMappings);
        db.itemToValueMappings.bulkAdd(goldiJson.data.itemToValueMappings);
        db.itemToValueAssignments.bulkAdd(goldiJson.data.itemToValueAssignments);
        toggleSaveNeeded(false);
      } else if (project) {
        setGoldiMeta(defaultMeta);
        toggleSaveNeeded(true);
      } else {
        alert("Fehler")
      }
    });
  }

  async function save(id: string): Promise<void> {
    const project = await appDataRepository.projects.get(id);
    if (project && goldiMeta && project.fileHandle) {
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
      const goldiJson: GoldiJSON = { meta: goldiMeta, data: goldiData }
      await writable.write(JSON.stringify(goldiJson, null, 2));
      // Close the file and write the contents to disk.
      await writable.close();
      toggleSaveNeeded(false);
    } else if (project && goldiMeta) {
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
      const goldiJson: GoldiJSON = { meta: goldiMeta, data: goldiData }
      await writable.write(JSON.stringify(goldiJson, null, 2));
      // Close the file and write the contents to disk.
      await writable.close();
      toggleSaveNeeded(false);
    } else {
      alert("Fehler")
    }
  }
}