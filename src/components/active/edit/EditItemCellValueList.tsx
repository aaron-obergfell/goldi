import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { Form, Stack } from "react-bootstrap";
import { Project } from "../../../db/appData";
import { GoldiColumn, GoldiItem, ProjectDataRepository, projectDataRepository } from "../../../db/projectData";
import { useOutsideClick } from "../../../logic/outsideClick";
import { mapToItem } from "../../../logic/values/valueService";

type EditItemCellValueListProps = {
  project: Project;
  column: GoldiColumn;
  item: GoldiItem;
  onNewValue: () => void;
  updateOnOutsideClick: boolean
}

export default function EditItemCellValueList(props: EditItemCellValueListProps) {

  const db: ProjectDataRepository = projectDataRepository(props.project.id);

  const values = useLiveQuery(() => db.values.where({
    columnId: props.column.id,
  }).toArray());

  const valueMappings = useLiveQuery(() => db.itemToValueMappings.where({
    itemId: props.item.id,
  }).toArray());

  const [userWantsToEdit, setUserWantsToEdit] = useState<boolean>(false);
  const [assignedValueIds, setAssignedValueIds] = useState<number[]>([]);

  useEffect(() => {
    if (valueMappings) {
      setAssignedValueIds(valueMappings.map(vm => vm.valueId!));
    }
  }, [valueMappings, values]);

  const reference = useOutsideClick(update);

  if (userWantsToEdit) {
    return (
      <div ref={props.updateOnOutsideClick ? reference : undefined}>
        <Form>
          {values?.map((v) => (
            <Form.Check
              type={'checkbox'}
              className={"my-2"}
              id={`checkbox-${v.id!}`}
            >
              <Form.Check.Input // prettier-ignore
                type={'checkbox'}
                checked={assignedValueIds.includes(v.id!)}
                onChange={e => {
                  if (e.target.checked) {
                    setAssignedValueIds(valueIds => [...valueIds, v.id!]);
                  } else {
                    setAssignedValueIds(l => l.filter(item => item !== v.id!))
                  }
                }}
              />
              <Form.Check.Label>
                <span
                  className='p-1 rounded'
                  style={{
                    color: v.color,
                    backgroundColor: v.bgColor,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {v.value}
                </span>
              </Form.Check.Label>
            </Form.Check>
          ))}
        </Form>
        <button
          className="w-100 bg-light"
          onClick={props.onNewValue}
          style={{
            border: 'none',
          }}
        >
          New value
        </button>
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
      <Stack gap={1}>
        {values?.filter(v => assignedValueIds.includes(v.id!)).map((v) => (
          <span
            className='px-1 rounded'
            style={{
              color: v.color,
              backgroundColor: v.bgColor,
              whiteSpace: 'nowrap'
            }}
          >
            {v.value}
          </span>
        ))}
      </Stack>
    </button>
  );

  async function update() {
    await mapToItem(assignedValueIds, props.item, props.project);
    setUserWantsToEdit(false);
  }
}
