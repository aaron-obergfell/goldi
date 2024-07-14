import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { Accordion, Col, Container, Row, Stack, Table } from "react-bootstrap";
import { Project } from "../../../db/appData";
import { GoldiColumn, ProjectDataRepository, projectDataRepository } from "../../../db/projectData";
import { GoldiMeta } from "../../../types/goldi";
import { InMemoryItem } from "../view/GoldiView";
import RowForItem from "./RowForItem";
import SmallGoldiButton from '../../globals/SmallGoldiButton';
import recycleBinIcon from '../../../icons/recycle-bin.png';
import editIcon from '../../../icons/edit.png';
import leftIcon from '../../../icons/left.png';
import rightIcon from '../../../icons/right.png';
import { deleteColumn, moveLeft, moveRight } from "../../../logic/columns/columnsService";
import ChangeColumnNameModal from "./ChangeColumnNameModal";
import ColumnDeleteConfirmationModal from "./ColumnDeleteConfirmationModal";

type EditGoldiTableProps = {
  project: Project;
  // onFinish: () => void;
}

export default function EditGoldiTable(props: EditGoldiTableProps) {

  const db: ProjectDataRepository = projectDataRepository(props.project.id);

  const columns = useLiveQuery(() => db.columns.orderBy("position").filter(column => column.visible).toArray());
  const [columnToChange, setColumnToChange] = useState<GoldiColumn | undefined>(undefined);
  const [columnToDelete, setColumnToDelete] = useState<GoldiColumn | undefined>(undefined);

  return (
    <>
      {columnToChange &&
        <ChangeColumnNameModal
          project={props.project}
          column={columnToChange}
          onFinish={() => setColumnToChange(undefined)} />
      }
      {columnToDelete &&
        <ColumnDeleteConfirmationModal
          project={props.project}
          column={columnToDelete}
          onFinish={() => setColumnToDelete(undefined)} />
      }
      <Table bordered responsive>
        <thead>
          <tr>
            {columns?.map((column) => (
              <td key={column.id}>
                <h4>{column.name}</h4>
                <p><i>{column.description}</i></p>
                <hr />
                <Stack direction="horizontal" gap={2} style={{ width: '100%' }}>
                  <SmallGoldiButton
                    active={true}
                    onClick={() => moveLeft(props.project, column)}
                    icon={leftIcon}
                    tooltipText={"Diese Spalte nach links verschieben"}
                  />
                  <SmallGoldiButton
                    active={true}
                    onClick={() => setColumnToDelete(column)}
                    icon={recycleBinIcon}
                    tooltipText={"Diese Spalte löschen"}
                  />
                  <SmallGoldiButton
                    active={true}
                    onClick={() => setColumnToChange(column)}
                    icon={editIcon}
                    tooltipText={"Spaltenüberschrift bearbeiten"}
                  />
                  <SmallGoldiButton
                    active={true}
                    onClick={() => moveRight(props.project, column)}
                    icon={rightIcon}
                    tooltipText={"Diese Spalte nach rechts verschieben"}
                  />
                </Stack>
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {columns?.map((column) => (
              <td key={column.id}>{"Wert_1_" + column.id}</td>
            ))}
          </tr>
          <tr>
            {columns?.map((column) => (
              <td key={column.id}>{"Wert_2_" + column.id}</td>
            ))}
          </tr>
          <tr>
            {columns?.map((column) => (
              <td key={column.id}>{"Wert_3_" + column.id}</td>
            ))}
          </tr>
          <tr>
            {columns?.map((column) => (
              <td key={column.id}>{"Wert_4_" + column.id}</td>
            ))}
          </tr>
          <tr>
            {columns?.map((column) => (
              <td key={column.id}>{"Wert_5_" + column.id}</td>
            ))}
          </tr>
          <tr>
            {columns?.map((column) => (
              <td key={column.id}>{"Wert_6_" + column.id}</td>
            ))}
          </tr>
        </tbody>
      </Table>
    </>
  );
}