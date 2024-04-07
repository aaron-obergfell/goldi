import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { appDataRepository } from '../db/appData';
import { defaultMeta, GoldiData, GoldiJSON, GoldiMeta } from '../types/goldi';
import GoldiView from './GoldiView';
import GoldiEditMeta from './GoldiEditMeta';
import { onBeforeUnload } from '../window/onbeforeunload';
import EditColumns from './EditColumns';
import { getFileHandleFromSavePicker, getWritable } from '../fs/fileHandleHelper';
import { projectDataRepository } from '../db/projectData';
import NewItemForm from './NewItemForm';

type ActiveGoldiProps = {
  projectId: string;
  onClose: () => void;
}

enum GoldiMode {
  View = "VIEW",
  EditMeta = "EDIT_META",
  EditColumns = "EDIT_COLUMNS",
  NewItem = "NEW_ITEM"
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
    <div>
      <Button onClick={() => save(props.projectId)} variant="info" disabled={!saveNeeded}>
        Save
      </Button>
      ------
      <Button onClick={() => loadFile(props.projectId)} variant="info" disabled={!saveNeeded}>
        Reload from disc
      </Button>
      ------
      <Button onClick={() => setGoldiMode(GoldiMode.View)} variant="info" disabled={goldiMode === GoldiMode.View}>
        View
      </Button>
      ------
      <Button onClick={() => setGoldiMode(GoldiMode.NewItem)} variant="info" disabled={goldiMode !== GoldiMode.View}>
        New Item
      </Button>
      ------
      <Button onClick={() => setGoldiMode(GoldiMode.EditMeta)} variant="info" disabled={goldiMode !== GoldiMode.View}>
        Edit Meta
      </Button>
      ------
      <Button onClick={() => setGoldiMode(GoldiMode.EditColumns)} variant="info" disabled={goldiMode !== GoldiMode.View}>
        Edit Columns
      </Button>
      ------
      <Button onClick={props.onClose} variant="info" disabled={saveNeeded}>
        X
      </Button>
      {(goldiMeta && (goldiMode === GoldiMode.View)) &&
        <GoldiView projectId={props.projectId} goldiMeta={goldiMeta}></GoldiView>
      }
      {(goldiMeta && (goldiMode === GoldiMode.EditMeta)) &&
        <GoldiEditMeta
          currentGoldiMeta={goldiMeta}
          onUpdate={(updatedGoldiMeta: GoldiMeta) => {
            setGoldiMode(GoldiMode.View);
            setGoldiMeta(updatedGoldiMeta);
            toggleSaveNeeded(true);
          }}
        />
      }
      {(goldiMode === GoldiMode.EditColumns) &&
        <EditColumns
          projectId={props.projectId}
          onUpdate={() => {
            toggleSaveNeeded(true);
          }}
          onDone={() => {
            setGoldiMode(GoldiMode.View);
          }}
        />
      }
      {(goldiMode === GoldiMode.NewItem) &&
        <NewItemForm
          projectId={props.projectId}
          onLeave={() => setGoldiMode(GoldiMode.View)}
        />
      }
    </div>
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