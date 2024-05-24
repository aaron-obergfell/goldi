import { useLiveQuery } from 'dexie-react-hooks';
import { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { GoldiColumn, GoldiColumnType, GoldiItem, GoldiValue, ItemToValueAssignment, ProjectDataRepository, projectDataRepository } from '../../../db/projectData';
import { GoldiMeta } from '../../../types/goldi.js';
import GoldiColorBar from '../../globals/GoldiColorBar';
import RowForItem from '../edit/RowForItem';

type GoldiViewProps = {
  projectId: string;
  goldiMeta: GoldiMeta;
}

export type InMemoryItem = {
  item: GoldiItem;
  cells: InMemoryCell[]
}

type InMemoryCell = {
  column: GoldiColumn;
  values: string | number | GoldiValue | GoldiValue[]
}

export default function GoldiView(props: GoldiViewProps) {

  const db: ProjectDataRepository = projectDataRepository(props.projectId);

  const [inMemoryItems, setInMemoryItems] = useState<InMemoryItem[]>([]);

  const columns = useLiveQuery(() => db.columns.orderBy("position").filter(column => column.visible).toArray());

  useEffect(() => {
    computeInMemoryItems();
  }, [columns]);

  return (
    <>
      <h1>{props.goldiMeta.title}</h1>
      <GoldiColorBar color={props.goldiMeta.color} />
      <p>
        {props.goldiMeta.description}
      </p>
      {
        columns ? (
          <Table responsive>
            <thead>
              <tr>
                <th>Titel</th>
                {columns.map((column) => (
                  <th key={column.id}>{column.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inMemoryItems.map((inMemoryItem) => (
                <RowForItem inMemoryItem={inMemoryItem}/>
              ))}
            </tbody>
          </Table>
        ) : (
          "loading"
        )
      }

    </>
  );

  async function computeInMemoryItems(): Promise<void> {
    if (!columns) {
      return;
    }
    const allItems = await db.items.toArray();
    let imi: InMemoryItem[] = [];
    for (const item of allItems) {
      const cells = await computeInMemoryCells(item);
      imi.push({
        item: item,
        cells: cells
      })
    }
    setInMemoryItems(imi);
  }

  async function computeInMemoryCells(item: GoldiItem): Promise<InMemoryCell[]> {
    const allValues = await db.values.toArray();
    const allValueIdsForItem = (await db.itemToValueMappings.where({itemId: item.id}).toArray()).map(itvm => itvm.valueId);
    const allValueAssignmentsForItem = await db.itemToValueAssignments.where({itemId: item.id}).toArray();
    const imc: InMemoryCell[] = [];
    for (const column of columns!) {
      if(column.type === GoldiColumnType.List) {
        const allValueIdsForColumn = (await db.values.where({columnId: column.id}).toArray()).map(v => v.id);
        const allValuesIdsForItemAndColumn = allValueIdsForColumn.filter(id => allValueIdsForItem.includes(id!));
        imc.push({
          column: column,
          values: allValues.filter(v => allValuesIdsForItemAndColumn.includes(v.id))
        });
      }
      if(column.type === GoldiColumnType.Text) {
        const allValuesIdsForItemAndColumns: ItemToValueAssignment[] = allValueAssignmentsForItem.filter(avafi => avafi.columnId === column.id!);
        if (allValuesIdsForItemAndColumns.length >= 1) {
          const v = allValuesIdsForItemAndColumns[0].value;
          imc.push({
            column: column,
            values: v
          });
        } else {
          imc.push({
            column: column,
            values: ""
          });
        }
      }
    }
    return imc;
  }

}