import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Project } from "../../../db/appData";
import { GoldiColumn, GoldiColumnType, GoldiItem, ProjectDataRepository, projectDataRepository } from "../../../db/projectData";
import { updateValue } from "../../../logic/items/itemsToValueAssignmentService";
import { useOutsideClick } from "../../../logic/outsideClick";

type EditItemCellSingleValueProps = {
  project: Project;
  column: GoldiColumn;
  item: GoldiItem;
}

export default function EditItemCellSingleValue(props: EditItemCellSingleValueProps) {

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
            if (e.key === "Enter" || e.key === "Tab") {
              update();
            }
            if (e.key === "Escape") {
              cancel();
            }
          }}
          autoFocus
          step={props.column.type === GoldiColumnType.Float ? "0.001" : "1"}
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
        border: 'none',
        textAlign: 'left'
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

  function cancel() {
    if (itemToValueAssignment) {
      setCellValue(itemToValueAssignment.value);
    } else {
      setCellValue(undefined);
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
