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
  const [cellValue, setCellValue] = useState<string | number>("");

  useEffect(() => {
    if (itemToValueAssignment) {
      setCellValue(itemToValueAssignment.value);
    }
  }, [itemToValueAssignment]);

  const ref = useOutsideClick(() => {
    setUserWantsToEdit(false);
  });

  if (userWantsToEdit) {
    return (
      <InputGroup className="mb-3" ref={ref}>
        <Form.Control
          type={mapToHtmlInputType(props.column.type)}
          value={cellValue}
          aria-describedby="basic-addon2"
          onChange={e => setCellValue(e.target.value as unknown as number)}
        />
        <Button
          variant="outline-dark"
          id="button-addon2"
          onClick={update}
        >
          Ok
        </Button>
      </InputGroup>

    )
  }

  return (
    <Stack direction="horizontal" gap={3}>
      <div className="p-2">
        {cellValue}
      </div>
      <div className="p-2 ms-auto">
        <SmallGoldiButton
          active={true}
          onClick={() => setUserWantsToEdit(true)}
          icon={editIcon}
          tooltipText={"Wert ändern"}
          visibleOnHover={true}
        />
      </div>
    </Stack>
  );

  async function update() {
    await updateValue(props.project, props.item, props.column, cellValue);
    setUserWantsToEdit(false)
  }

  function mapToHtmlInputType(columnType: GoldiColumnType): string {
    switch(columnType) {
      case GoldiColumnType.Float: return "number";
      case GoldiColumnType.Integer: return "number";
      case GoldiColumnType.Text: return "text";
      default: return "";
    }
  }
}
