import { useLiveQuery } from 'dexie-react-hooks';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { projectDataRepository } from '../db/projectData';
import NewColumn from './NewColumn';

type EditColumnsProps = {
  projectId: string;
  onUpdate: () => void;
  onDone: () => void;
}

export default function EditColumns(props: EditColumnsProps) {

  const columns = useLiveQuery(() => projectDataRepository(props.projectId).columns.toArray());
  const [userWantsToAddColumn, setUserWantsToAddColumn] = useState<boolean>(false);

  return (
    <>
      <ul>
        {columns?.map((column) => (
          <li key={column.id}>
            {column.name}, {column.type}
          </li>
        ))}
      </ul>
      {
        userWantsToAddColumn &&
        <NewColumn
          projectId={props.projectId}
          onSave={() => {
            props.onUpdate();
            setUserWantsToAddColumn(false);
          }}
          onCancel={() => setUserWantsToAddColumn(false)}
        />
      }
      {
        !userWantsToAddColumn &&
        <Button onClick={() => setUserWantsToAddColumn(true)} variant="info">
          New
        </Button>
      }
      ---
      <Button onClick={props.onDone} variant="info">
        Done
      </Button>
    </>

  );
}