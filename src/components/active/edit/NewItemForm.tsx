import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { GoldiColumn, GoldiColumnType, GoldiItem, ItemToValueAssignment, ItemToValueMapping, ProjectDataRepository, projectDataRepository } from "../../../db/projectData";

type NewItemFormProps = {
  projectId: string;
  onLeave: () => void;
}

export default function NewItemForm(props: NewItemFormProps) {

  const db: ProjectDataRepository = projectDataRepository(props.projectId);

  const columns = useLiveQuery(() => db.columns.orderBy("position").toArray());
  const values = useLiveQuery(() => db.values.toArray());

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [valueIds, setValueIds] = useState<number[]>([]);
  const [assignments, setAssignments] = useState<{columnId: number, value: string}[]>([]);


  return (
    <>
      <h1>Neuer Eintrag</h1>
      {
        columns && values ? (<>
          <Form.Group>
            <Form.Label>Titel</Form.Label>
            <Form.Control
              type='text'
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              type='textArea'
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </Form.Group>
          <Table responsive>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.id}>{column.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {columns.map((column) => (
                  <td key={column.id}>
                    {
                      column.type === GoldiColumnType.List &&
                      <>
                        {values.filter(v => v.columnId === column.id).map((v) => (
                          <Form.Check // prettier-ignore
                            type={'checkbox'}
                            id={`default-` + v.value}
                            label={v.value}
                            onChange={e => {
                              if (e.target.checked) {
                                setValueIds(valueIds => [...valueIds, v.id!]);
                              } else {
                                setValueIds(l => l.filter(item => item !== v.id!))
                              }
                            }}
                          />
                        ))}
                      </>
                    }
                    {
                      column.type === GoldiColumnType.Text &&
                      <>
                        <Form.Control
                          type='text'
                          onChange={e => updateAssignments(column, e.target.value)}
                        />
                      </>
                    }
                  </td>
                ))}
              </tr>
            </tbody>
          </Table>
          <Button onClick={saveItem} variant="info">
            Save
          </Button>
        </>
        ) : (
          "loading"
        )
      }
    </>
  );

  async function saveItem() {
    const newItem: GoldiItem = {
      titel: title,
      description: description
    }
    const newId: number = await db.items.add(newItem);
    valueIds.forEach(valueId => {
      const newMapping: ItemToValueMapping = {
        itemId: newId,
        valueId: valueId
      }
      db.itemToValueMappings.add(newMapping);
    })
    assignments.forEach(a => {
      const newAssignment: ItemToValueAssignment = {
        itemId: newId,
        value: a.value,
        columnId: a.columnId
      }
      db.itemToValueAssignments.add(newAssignment);
    })
    props.onLeave();
  }

  function updateAssignments(column: GoldiColumn, value: string): void {
    setAssignments([...assignments.filter(a => a.columnId !== column.id!), {columnId: column.id!, value: value}]);
  }
}