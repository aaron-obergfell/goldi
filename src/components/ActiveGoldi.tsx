import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import {  appDataRepository } from '../db/appData.ts';

type ActiveGoldiProps = {
  projectId: string;
  onClose: () => void;
}

export default function ActiveGoldi(props: ActiveGoldiProps) {

  const [fileName, setFileName] = useState<string>("");
  const [fileContent, setFileContent] = useState<string>("");

  useEffect(() => {
    getFile(props.projectId);
    document.title = fileName;
  });

  return (
    <div>
      <Button onClick={props.onClose} variant="info" size="lg">
        X
      </Button>
      <h1>{fileName}</h1>
      <p>
        {fileContent}
      </p>
    </div>
  );

  async function getFile(id) {
    const project = await appDataRepository.projects.get(id);
    if (project) {
      let f = await project.fileHandle.getFile();
      setFileName(f.name);
      setFileContent(await f.text());
    } else {
      alert("Fehler")
    }
  }
}