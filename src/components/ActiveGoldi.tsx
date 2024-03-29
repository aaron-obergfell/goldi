import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import {  appDataRepository } from '../db/appData.ts';
import { GoldiData, GoldiJSON, GoldiMeta } from '../types/goldi.js';

type ActiveGoldiProps = {
  projectId: string;
  onClose: () => void;
}

export default function ActiveGoldi(props: ActiveGoldiProps) {

  const [goldiMeta, setGoldiMeta] = useState<GoldiMeta | undefined>(undefined);

  useEffect(() => {
    loadFile(props.projectId);
    if (goldiMeta) document.title = goldiMeta.title;
  });

  return (
    <div>
      <Button onClick={props.onClose} variant="info" size="lg">
        X
      </Button>
      <h1>{goldiMeta?.title}</h1>
      <div style={{
        backgroundColor: goldiMeta?.color,
        width: 600,
        height: 30,
      }}>
      </div>
      <p>
        {goldiMeta?.description}
      </p>
    </div>
  );

  async function loadFile(id) {
    const project = await appDataRepository.projects.get(id);
    if (project) {
      let file = await project.fileHandle.getFile();
      let goldiJson: GoldiJSON = JSON.parse(await file.text());
      setGoldiMeta(goldiJson.meta);
    } else {
      alert("Fehler")
    }
  }
}