import Dexie, { Table } from 'dexie';
import { GoldiMeta } from '../types/goldi';

export type Project = {
    id: string;
    fileHandle: FileSystemFileHandle | undefined;
    meta: GoldiMeta;
    checkSum: string | undefined;
    state: ProjectState;
}

export enum ProjectState {
    Empty = "EMPTY",
    Draft = "DRAFT",
    InSync = "IN_SYNC",
    AheadOfFile = "AHEAD_OF_FILE"
}

export class AppDataRepository extends Dexie {
    projects!: Table<Project>;

    constructor() {
        super("AppData");
        this.version(1).stores({
            projects: 'id'
        });
    }
}

export const appDataRepository = new AppDataRepository();