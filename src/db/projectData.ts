import Dexie, { Table } from 'dexie';

export enum GoldiColumnType  {
    Text = "TEXT",
    Enum = "ENUM",
    List = "LIST",
    Image = "IMAGE",
    Integer = "INTEGER",
    Float = "FLOAT",
    Date = "DATE",
    DateTime = "DATE_TIME"
}

export type GoldiColumn = {
    id?: number;
    name: string;
    type: GoldiColumnType;
    position: number;
    visible: boolean;
}

export class ProjectDataRepository extends Dexie {
    columns!: Table<GoldiColumn>;

    constructor(dbName: string) {
        super(dbName);
        this.version(1).stores({
            columns: '++id, position'
        });
    }
}

export const projectDataRepository = (dbName: string) => new ProjectDataRepository(dbName);