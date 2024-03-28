import logo from './logo.png';
import './App.css';
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Accordion from 'react-bootstrap/Accordion';

import { chooseAFile, openFileOnLaunch } from './file-management/open';

function App() {

  const [projectId, setProjectId] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [recent, setRecent] = useState([]);
  useEffect(() => {
    window.launchQueue.setConsumer((launchParams) => {
      openFileOnLaunch(launchParams, setProjectId);
    });
    getAll();
  }, []);

  if (projectId) {
    getFile(projectId);
    document.title = fileName;
    return (
      <div>
        <Button onClick={() => { setProjectId(null); getAll(); }} variant="info" size="lg">
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
        let permission = r.permissionState;
        return (
          <Button onClick={() => setProjectId(r.id)} variant="secondary" size="lg" disabled={permission != 'granted'}>
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
