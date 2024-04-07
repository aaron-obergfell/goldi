import Dexie, { Table } from 'dexie';

export enum GoldiColumnType {
    Text = "TEXT",
    // Enum = "ENUM",
    List = "LIST",
    // Image = "IMAGE",
    // Integer = "INTEGER",
    // Float = "FLOAT",
    // Date = "DATE",
    // DateTime = "DATE_TIME"
}

export type GoldiColumn = {
    id?: number;
    name: string;
    type: GoldiColumnType;
    position: number;
    visible: boolean;
}

export type GoldiValue = {
    id?: number;
    value: string;
    color: string;
    bgColor: string;
    columnId: number;
}

export type GoldiItem = {
    id?: number;
    titel: string;
    description: string;
}

export type GoldiImage = {
    id?: number;
    base64: number;
    valueId: number;
}

export type ItemToValueMapping = {
    id?: number;
    itemId: number;
    valueId: number;
}

export type ItemToImageMapping = {
    id?: number;
    itemId: number;
    columnId: number;
    imageId: number;
}

export type ItemToValueAssignment = {
    id?: number;
    itemId: number;
    columnId: number;
    value: string | number;
}

export class ProjectDataRepository extends Dexie {
    columns!: Table<GoldiColumn>;
    values!: Table<GoldiValue>;
    items!: Table<GoldiItem>;
    images!: Table<GoldiImage>;
    itemToValueMappings!: Table<ItemToValueMapping>;
    itemToImageMappings!: Table<ItemToImageMapping>;
    itemToValueAssignments!: Table<ItemToValueAssignment>;

    constructor(dbName: string) {
        super(dbName);
        this.version(1).stores({
            columns: '++id, position',
            values: '++id, columnId',
            items: '++id',
            images: '++id',
            itemToValueMappings: '++id, itemId',
            itemToImageMappings: '++id',
            itemToValueAssignments: '++id, value, itemId'
        });
    }
}

export const projectDataRepository = (dbName: string) => new ProjectDataRepository(dbName);