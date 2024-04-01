import { useLiveQuery } from 'dexie-react-hooks';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { GoldiColumnType, projectDataRepository } from '../db/projectData';

type NewColumnProps = {
  projectId: string;
  onSave: () => void;
  onCancel: () => void;
}

export default function NewColumn(props: NewColumnProps) {

  const [newName, setNewName] = useState<string>("");
  const [newType, setNewType] = useState<GoldiColumnType>(GoldiColumnType.Text);

  async function addColumn() {
    try {
      const id = await projectDataRepository(props.projectId).columns.add({
        name: newName,
        type: newType
      });
    } catch (error) {
      console.error(`Failed to add ${newName}: ${error}`);
    }
  }

  return (
    <Form style={{ width: '300px' }}>
      <Form.Group>
        <Form.Label>Name</Form.Label>
        <Form.Control
          type='text'
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Select
          value={newType}
          onChange={e => setNewType(e.target.value as GoldiColumnType)}
        >
          {Object.values(GoldiColumnType).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Button onClick={() => { addColumn(); props.onSave(); }} variant="info">
        Save
      </Button>
      ---
      <Button onClick={props.onCancel} variant="info">
        Cancel
      </Button>
    </Form>

  );
}