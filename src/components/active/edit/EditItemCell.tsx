import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useRef, useState } from "react";
import { Button, Form, InputGroup, Stack, Table } from "react-bootstrap";
import { Project } from "../../../db/appData";
import { GoldiColumn, GoldiColumnType, GoldiItem, ItemToValueAssignment, ItemToValueMapping, ProjectDataRepository, projectDataRepository } from "../../../db/projectData";
import SmallGoldiButton from "../../globals/SmallGoldiButton";
import editIcon from '../../../icons/edit.png';
import { updateValue } from "../../../logic/items/itemsToValueAssignmentService";
import { useOutsideClick } from "../../../logic/outsideClick";

type EditItemCellProps = {
  project: Project;
  column: GoldiColumn;
  item: GoldiItem;
  onLock: () => void;
  onRelease: () => void;
}

export default function EditItemCell(props: EditItemCellProps) {

  const db: ProjectDataRepository = projectDataRepository(props.project.id);

  const itemToValueAssignment = useLiveQuery(() => db.itemToValueAssignments.where({
    columnId: props.column.id,
    itemId: props.item.id
  }).first());

  const [userWantsToEdit, setUserWantsToEdit] = useState<boolean>(false);
  const [cellValue, setCellValue] = useState<string | number | undefined>(undefined);

  useEffect(() => {
    if (itemToValueAssignment) {
      setCellValue(itemToValueAssignment.value);
    }
  }, [itemToValueAssignment]);

  const reference = useOutsideClick(update);

  if (userWantsToEdit) {
    return (
      <div ref={reference}>
        <Form.Control
          className="shadow-none"
          type={mapToHtmlInputType(props.column.type)}
          value={cellValue}
          onChange={e => setCellValue(e.target.value as unknown as number)}
          onKeyDown={e => {
            console.log(e.key);
            if (e.key === "Enter" || e.key === "Tab") {
              update();
            }
          }}
          autoFocus
          step={props.column.type === GoldiColumnType.Float ? "0.01" : "1"}
        />
      </div>
    )
  }

  return (
    <button
      className="w-100 bg-light"
      onClick={() => setUserWantsToEdit(true)}
      style={{
        minHeight: '1.5em',
        border: 'none'
      }}
    >
      {cellValue}
    </button>
  );

  async function update() {
    if (cellValue && (!itemToValueAssignment || itemToValueAssignment.value !== cellValue)) {
      await updateValue(props.project, props.item, props.column, cellValue);
    }
    setUserWantsToEdit(false)
  }

  function mapToHtmlInputType(columnType: GoldiColumnType): string {
    switch (columnType) {
      case GoldiColumnType.Float: return "number";
      case GoldiColumnType.Integer: return "number";
      case GoldiColumnType.Text: return "text";
      default: return "";
    }
  }
}
