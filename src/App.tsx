import './App.css';
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';

import { chooseAFile, openFileOnLaunch } from './file-management/open';

declare global {
  interface Window { launchQueue: any; }
  interface LaunchParams {
    readonly files: FileSystemFileHandle[];
  }
}

function App() {

  type FileWithMeta = {
    id: string,
    fileHandle: FileSystemFileHandle,
    permissionState: PermissionStatus
  }

  const [projectId, setProjectId] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string>("");
  const [fileContent, setFileContent] = useState<string>("");
  const [recent, setRecent] = useState<FileWithMeta[]>([]);
  useEffect(() => {
    if ('launchQueue' in window) {
      window.launchQueue.setConsumer((launchParams: LaunchParams) => {
        openFileOnLaunch(launchParams, setProjectId);
      });
      getAll();
    }
  }, []);

  if (projectId) {
    getFile(projectId);
    document.title = fileName;
    return (
      <div>
        <Button onClick={() => { setProjectId(undefined); getAll(); }} variant="info" size="lg">
          Overview
        </Button>
        <h1>{fileName}</h1>
        <p>
          {fileContent}
        </p>
      </div>
    );
  }
  document.title = "Open | New | Recent";
  return (
    <div className="App">
      <Stack gap={3}>{recent.map(r => {
        return (
          <Button onClick={() => setProjectId(r.id)} variant="secondary" size="lg" disabled={r.permissionState.name !== 'granted'}>
            {r.fileHandle.name}
          </Button>)
      })
      }
      </Stack>
      <Button onClick={() => chooseAFile(setProjectId)} variant="info">
        Open
      </Button>
    </div>
  );

  async function getFile(id) {
    let db;
    let file;
    const request = window.indexedDB.open('AppData');

    request.onsuccess = async (e) => {
      // Create DB connection
      db = request.result;
      const transaction = db.transaction('FileHandlers')
        .objectStore('FileHandlers')
        .get(id);

      transaction.onsuccess = async () => {
        const fileHandlerWithId = transaction.result;
        let f = await fileHandlerWithId.fileHandle.getFile();
        setFileName(f.name);
        setFileContent(await f.text());
      }

      transaction.onerror = (err) => {
        console.error(`Error: ${err}`)
      }
    };
    return file;
  }

  async function getAll() {
    let db;
    let file;
    const request = window.indexedDB.open('AppData');

    request.onsuccess = async (e) => {
      // Create DB connection
      db = request.result;
      const transaction = db.transaction('FileHandlers')
        .objectStore('FileHandlers')
        .getAll();

      transaction.onsuccess = async () => {
        const allFileHandlerWithId = transaction.result;
        let alsoWithPermission = await Promise.all(allFileHandlerWithId.map(async o => {
          return {
            id: o.id,
            fileHandle: o.fileHandle,
            permissionState: await o.fileHandle.queryPermission()
          }
        }));
        setRecent(alsoWithPermission);
      }

      transaction.onerror = (err) => {
        console.error(`Error: ${err}`)
      }
    };
    return file;
  }
}


export default App;
