import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { GoldiColumn, GoldiColumnType, projectDataRepository } from '../db/projectData';

type ColumnFormProps = {
  projectId: string;
  onSave: () => void;
  onCancel: () => void;
  goldiColumn: GoldiColumn | undefined;
}

export default function ColumnForm(props: ColumnFormProps) {

  const [name, setNewName] = useState<string>(props.goldiColumn ? props.goldiColumn.name : "");
  const [type, setNewType] = useState<GoldiColumnType>(props.goldiColumn ? props.goldiColumn.type : GoldiColumnType.Text);
  const [visible, toggleIsVisible] = useState<boolean>(props.goldiColumn ? props.goldiColumn.visible : true);

  return (
    <tr>
      <td>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='text'
            value={name}
            onChange={e => setNewName(e.target.value)}
          />
        </Form.Group>
      </td >
      <td>
        <Form.Group>
          <Form.Label>Typ</Form.Label>
          <Form.Select
            value={type}
            onChange={e => setNewType(e.target.value as GoldiColumnType)}
          >
            {Object.values(GoldiColumnType).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </td>
      <td>
        <Form.Group>
          <Form.Label>Visible</Form.Label>
          <Form.Check
            checked={visible}
            type="switch"
            id="custom-switch"
            onChange={e => toggleIsVisible(e.target.checked)}
          />
        </Form.Group>
      </td>
      <td>
        <Button
          onClick={() => {
            if (props.goldiColumn) {
              updateColumn();
            } else {
              addColumn();
            }
            props.onSave();
          }}
          variant="info"
          size="sm"
        >
          Save
        </Button>
        ---
        <Button onClick={props.onCancel} variant="info" size="sm">
          Cancel
        </Button>
      </td>
    </tr>

  );

  async function addColumn() {
    try {
      const columnCount: number = await projectDataRepository(props.projectId).columns.count();
      await projectDataRepository(props.projectId).columns.add({
        name: name,
        type: type,
        visible: visible,
        position: await determineNewPosition()
      });
    } catch (error) {
      console.error(`Failed to add ${name}: ${error}`);
    }
  }



  async function updateColumn() {
    try {
      await projectDataRepository(props.projectId).columns.update(props.goldiColumn?.id, {
        name: name,
        type: type,
        visible: visible
      });
    } catch (error) {
      console.error(`Failed to update column: ${props.goldiColumn?.id}`);
    }
  }

  async function determineNewPosition(): Promise<number> {
    const lastColumn: GoldiColumn | undefined = await projectDataRepository(props.projectId).columns
      .orderBy("position")
      .last();
    if (lastColumn) {
      return lastColumn.position + 1;
    } else {
      return 1;
    }
  }
}