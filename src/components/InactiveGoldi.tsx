import React, { useState, useEffect } from 'react';
import { Button, Stack } from 'react-bootstrap';

import { chooseAFile } from '../fs/open';
import { appDataRepository } from '../db/appData';
import { getPermission } from '../fs/fileHandleHelper';

type InactiveGoldiProps = {
  open: (projectId: string) => void;
}

export default function InactiveGoldi(props: InactiveGoldiProps) {

  type FileWithMeta = {
    id: string,
    fileHandle: FileSystemFileHandle,
    permissionState: PermissionStatus
  }

  const [files, setFiles] = useState<FileWithMeta[]>([]);

  useEffect(() => {
    document.title = "Open | New | Recent";
    appDataRepository.projects.toArray().then(async (allProjects) => {
      let files: FileWithMeta[] = await Promise.all(allProjects.map(async project => {
        return {
          id: project.id,
          fileHandle: project.fileHandle,
          permissionState: await getPermission(project.fileHandle)
        }
      }));
      setFiles(files);
    });
  }, []);

  return (
    <div className="App">
      <Button onClick={() => chooseAFile(props.open)} variant="info" className="my-3" >
        Open
      </Button>
      <h3>Recent</h3>
      {
        files.map((file) => {
          return (
            <p key={file.id}>
              <Button
                onClick={() => props.open(file.id)}
                variant="danger"
                className="my-3"
                disabled={file.permissionState as unknown as string !== "granted"}>
                {file.fileHandle.name}
              </Button>
            </p>)
        })
      }
    </div>
  );
}