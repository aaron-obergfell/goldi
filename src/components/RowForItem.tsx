import { GoldiColumn, GoldiColumnType, GoldiValue } from '../db/projectData';
import { InMemoryItem } from './GoldiView';

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
            <ul>
              {(cell.values as unknown as GoldiValue[]).map((gv) => (
                <li>
                  {gv.value}
                </li>
              ))}
            </ul>
          }
        </td>
      ))}
    </tr>
  )
}