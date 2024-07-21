import { Stack } from 'react-bootstrap';
import { GoldiColumnType, GoldiValue } from '../../../db/projectData';
import { InMemoryItem } from '../view/GoldiView';

type RowForItemProps = {
  inMemoryItem: InMemoryItem;
}

export default function RowForItem(props: RowForItemProps) {

  return (
    <tr>
      <th>
        {props.inMemoryItem.item.titel}
      </th>
      {props.inMemoryItem.cells.map((cell) => (
        <td>
          {
            (cell.column.type === GoldiColumnType.Text) &&
            <span>{cell.values as unknown as string}</span>
          }
          {
            (cell.column.type === GoldiColumnType.List) &&
            <Stack gap={1}>
              {(cell.values as unknown as GoldiValue[]).map((v) => (
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
          }
        </td>
      ))}
    </tr>
  )
}