import React, { useState, useEffect, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { appDataRepository } from '../db/appData';
import { GoldiJSON, GoldiMeta } from '../types/goldi';
import GoldiView from './GoldiView';
import GoldiEditMeta from './GoldiEditMeta';
import { onBeforeUnload } from '../window/onbeforeunload';
import EditColumns from './EditColumns';
import { getWritable } from '../fs/fileHandleHelper';

type ActiveGoldiProps = {
  projectId: string;
  onClose: () => void;
}

enum GoldiMode {
  View = "VIEW",
  EditMeta = "EDIT_META",
  EditColumns = "EDIT_COLUMNS"
}

export default function ActiveGoldi(props: ActiveGoldiProps) {

  const [goldiMeta, setGoldiMeta] = useState<GoldiMeta | undefined>(undefined);
  const [goldiMode, setGoldiMode] = useState<GoldiMode>(GoldiMode.View);
  const [saveNeeded, toggleSaveNeeded] = useState<boolean>(false);

  useEffect(() => {
    loadFile(props.projectId);
  }, []);

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
      <Button onClick={() => loadFile(props.projectId)} variant="info">
        Reload from disc
      </Button>
      ------
      <Button onClick={() => setGoldiMode(GoldiMode.View)} variant="info" disabled={goldiMode === GoldiMode.View}>
        View
      </Button>
      ------
      <Button onClick={() => setGoldiMode(GoldiMode.EditMeta)} variant="info" disabled={goldiMode === GoldiMode.EditMeta}>
        Edit Meta
      </Button>
      ------
      <Button onClick={() => setGoldiMode(GoldiMode.EditColumns)} variant="info" disabled={goldiMode === GoldiMode.EditMeta}>
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
      {(goldiMeta && (goldiMode === GoldiMode.EditColumns)) &&
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
    </div>
  );

  async function loadFile(id: string): Promise<void> {
    const project = await appDataRepository.projects.get(id);
    if (project) {
      let file = await project.fileHandle.getFile();
      let goldiJson: GoldiJSON = JSON.parse(await file.text());
      setGoldiMeta(goldiJson.meta);
      toggleSaveNeeded(false)
    } else {
      alert("Fehler")
    }
  }

  async function save(id: string): Promise<void> {
    const project = await appDataRepository.projects.get(id);
    if (project && goldiMeta) {
      const fileHandle = await project.fileHandle;
      const writable = await getWritable(fileHandle);
      const goldiJson: GoldiJSON = { meta: goldiMeta, data: "ABC" }
      await writable.write(JSON.stringify(goldiJson, null, 2));
      // Close the file and write the contents to disk.
      await writable.close();
      toggleSaveNeeded(false);
    } else {
      alert("Fehler")
    }
  }
}