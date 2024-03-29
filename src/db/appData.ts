import Dexie, { Table } from 'dexie';

export type Project = {
    id: string;
    fileHandle: FileSystemFileHandle;
    title: string | undefined;
    description: string | undefined;
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