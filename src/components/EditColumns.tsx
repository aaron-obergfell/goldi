import { useLiveQuery } from 'dexie-react-hooks';
import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { GoldiColumn, projectDataRepository } from '../db/projectData';
import ColumnForm from './ColumnForm';
import RowForColumn from './RowForColumn';

type EditColumnsProps = {
  projectId: string;
  onUpdate: () => void;
  onDone: () => void;
}

export default function EditColumns(props: EditColumnsProps) {

  const columns: GoldiColumn[] | undefined = useLiveQuery(() => projectDataRepository(props.projectId).columns.orderBy('position').toArray());

  const [userWantsToAddColumn, setUserWantsToAddColumn] = useState<boolean>(false);

  useEffect(() => {
    console.log("Änderung in store 'columns'");
  }, [columns]);

  return (
    <>
      <Table responsive>
        <thead>
          <tr>
            <th>Spalten-Name</th>
            <th>Spalten-Typ</th>
            <th>Spalten-Sichtbarkeit</th>
            <th>Mögliche Werte</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {columns?.map((column: GoldiColumn, index: number) => (
            <RowForColumn
              projectId={props.projectId}
              goldiColumn={column}
              canMoveUp={(columns[0] !== column)}
              canMoveDown={(columns[columns.length -1] !== column)}
            />
          ))}
          {
            userWantsToAddColumn ? (
              <ColumnForm
                projectId={props.projectId}
                onSave={() => {
                  props.onUpdate();
                  setUserWantsToAddColumn(false);
                }}
                onCancel={() => setUserWantsToAddColumn(false)}
                goldiColumn={undefined}
              />
            ) : (
              <tr>
                <td colSpan={4} className="text-center">
                  <Button onClick={() => setUserWantsToAddColumn(true)} variant="info">
                    New
                  </Button>
                </td>
              </tr>
            )
          }
        </tbody>
      </Table>

      ---
      <Button onClick={props.onDone} variant="info">
        Done
      </Button>
    </>

  );
}