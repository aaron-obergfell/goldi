import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { GoldiColumn, GoldiColumnType, GoldiValue, projectDataRepository } from '../../../db/projectData';
import ColumnForm from './ColumnForm';

type RowForColumnProps = {
  projectId: string;
  goldiColumn: GoldiColumn;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export default function RowForColumn(props: RowForColumnProps) {

  const [userWantsToEditColumn, setUserWantsToAEditColumn] = useState<boolean>(false);
  const possibleValues: GoldiValue[] | undefined = useLiveQuery(() => {
    return projectDataRepository(props.projectId).values.where({ columnId: props.goldiColumn.id }).toArray()
  });

  return (
    <>
      {userWantsToEditColumn ?
        (
          <ColumnForm
            projectId={props.projectId}
            onSave={() => setUserWantsToAEditColumn(false)}
            onCancel={() => setUserWantsToAEditColumn(false)}
            goldiColumn={props.goldiColumn}
          />
        ) : (
          <tr>
            <td>{props.goldiColumn.name}</td >
            <td>{props.goldiColumn.type}</td>
            <td>{props.goldiColumn.visible ? "Yes" : "No"}</td>
            <td>
              <ul>
                {
                  props.goldiColumn.type === GoldiColumnType.List &&
                  <>
                    {possibleValues?.map((goldiValue: GoldiValue) => (
                      <li>{goldiValue.value}</li>
                    ))}
                  </>
                }
              </ul>
            </td>
            <td>
              <Button onClick={() => setUserWantsToAEditColumn(true)} variant="info" size="sm">
                Edit
              </Button>
              <Button
                onClick={() => projectDataRepository(props.projectId).columns.delete(props.goldiColumn.id)}
                variant="danger"
                size="sm"
              >
                Delete
              </Button>
              <ButtonGroup vertical size="sm">
                <Button
                  disabled={!props.canMoveUp}
                  variant="secondary"
                  onClick={moveUp}
                >
                  Up
                </Button>
                <Button
                  disabled={!props.canMoveDown}
                  variant="secondary"
                  onClick={moveDown}
                >
                  Down
                </Button>
              </ButtonGroup>
            </td>
          </tr>
        )}
    </>
  )

  async function moveUp() {
    const columnForSwap: GoldiColumn | undefined = await projectDataRepository(props.projectId).columns
      .orderBy("position")
      .filter((otherColumn) => otherColumn.position < props.goldiColumn.position)
      .last();
    changePosition(columnForSwap);
  }

  async function moveDown() {
    const columnForSwap: GoldiColumn | undefined = await projectDataRepository(props.projectId).columns
      .orderBy("position")
      .filter((otherColumn) => otherColumn.position > props.goldiColumn.position)
      .first();
    changePosition(columnForSwap);
  }

  async function changePosition(columnForSwap: GoldiColumn | undefined) {
    if (columnForSwap) {
      const positionOfColumnForSwap: number = columnForSwap.position;
      // update columnForSwap
      await projectDataRepository(props.projectId).columns.update(columnForSwap.id, { position: props.goldiColumn.position })
      // update this one
      await projectDataRepository(props.projectId).columns.update(props.goldiColumn.id, { position: positionOfColumnForSwap })
    } else {
      console.error("Could not move up/down column with id " + props.goldiColumn.id);
    }
  }
}