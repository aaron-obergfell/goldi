import { appDataRepository, Project, ProjectState } from "../../db/appData";
import { v4 as uuidv4 } from 'uuid';
import { defaultMeta, GoldiData, GoldiJSON, GoldiMeta } from "../../types/goldi";
import md5 from 'md5';
import { newProjectError, ProjectErrorType } from "./projectError";
import { projectDataRepository } from "../../db/projectData";
import { getWritable } from "../../fs/fileHandleHelper";

export async function getRecentProjectOrElseUndefined(fileHandle: FileSystemFileHandle): Promise<Project | undefined> {
    let allProjects: Project[] = await appDataRepository.projects.toArray();
    for (var project of allProjects) {
        if (project.fileHandle && await fileHandle.isSameEntry(project.fileHandle)) {
            return project;
        }
    }
    return undefined;
}

export async function createNewProjectForFileHandle(fileHandle: FileSystemFileHandle): Promise<Project> {
    const newProject: Project = {
        id: uuidv4(),
        fileHandle: fileHandle,
        meta: defaultMeta,
        checkSum: undefined,
        state: ProjectState.Empty
    }
    await appDataRepository.projects.add(newProject);
    return newProject;
}

export async function createNewProjectWithoutFileHandle(): Promise<Project> {
    const newProject: Project = {
        id: uuidv4(),
        fileHandle: undefined,
        meta: defaultMeta,
        checkSum: undefined,
        state: ProjectState.Empty
    }
    await appDataRepository.projects.add(newProject);
    return newProject;
}

export async function getCheckSum(file: File): Promise<string> {
    return md5(await file.text());
}

export async function removeFileReference(project: Project): Promise<Project> {
    const updatedProject: Project = {
        ...project,
        fileHandle: undefined,
        checkSum: undefined,
        state: ProjectState.Draft
    };
    await appDataRepository.projects.update(project.id, updatedProject);
    return updatedProject;
}

export async function prepare(project: Project): Promise<void> {
    const fileContent = await getContentFromAssociatedFile(project);
    if (false) {
        throw newProjectError(project, ProjectErrorType.InvalidData);
    }
    const goldiJson: GoldiJSON = JSON.parse(fileContent);
    const projectUpdateSpec = {
        meta: goldiJson.meta,
        checkSum: md5(fileContent),
        state: ProjectState.InSync
    };
    await appDataRepository.projects.update(project.id, projectUpdateSpec);
    const db = projectDataRepository(project.id);
    await db.delete();
    await db.open();
    await db.columns.bulkAdd(goldiJson.data.columns);
    await db.values.bulkAdd(goldiJson.data.values);
    await db.items.bulkAdd(goldiJson.data.items);
    await db.images.bulkAdd(goldiJson.data.images);
    await db.itemToImageMappings.bulkAdd(goldiJson.data.itemToImageMappings);
    await db.itemToValueMappings.bulkAdd(goldiJson.data.itemToValueMappings);
    await db.itemToValueAssignments.bulkAdd(goldiJson.data.itemToValueAssignments);
}

export async function updateMetaData(project: Project, newMetaData: GoldiMeta) {
    const newState: ProjectState = project.fileHandle ? ProjectState.AheadOfFile : ProjectState.Draft;
    await appDataRepository.projects.update(project.id, {
        meta: newMetaData,
        state: newState
    });
}

export async function removeWithoutCheck(project: Project) {
    await projectDataRepository(project.id).delete();
    await appDataRepository.projects.delete(project.id);
}

export async function saveToFile(project: Project): Promise<void> {
    if (!project.fileHandle) {
        throw Error("No fileHandle found for project.");
    }
    const writable = await getWritable(project.fileHandle);
    const goldiJson: GoldiJSON = await computeGoldiJSON(project);
    await writable.write(JSON.stringify(goldiJson, null, 2));
    await writable.close();
    await markAsInSync(project);
}

export async function saveToOtherFile(project: Project, fileHandle: FileSystemFileHandle): Promise<void> {
    const writable = await getWritable(fileHandle);
    const goldiJson: GoldiJSON = await computeGoldiJSON(project);
    await writable.write(JSON.stringify(goldiJson, null, 2));
    await writable.close();
}

export async function addFileHandle(project: Project, fileHandle: FileSystemFileHandle): Promise<Project> {
    const updatedProject: Project = {
        ...project,
        fileHandle: fileHandle
    };
    await appDataRepository.projects.update(project.id, updatedProject);
    return updatedProject;
}

async function computeGoldiJSON(project: Project): Promise<GoldiJSON> {
    const db = projectDataRepository(project.id);
    const goldiData: GoldiData = {
        columns: await db.columns.toArray(),
        values: await db.values.toArray(),
        items: await db.items.toArray(),
        images: await db.images.toArray(),
        itemToImageMappings: await db.itemToImageMappings.toArray(),
        itemToValueMappings: await db.itemToValueMappings.toArray(),
        itemToValueAssignments: await db.itemToValueAssignments.toArray()
    }
    return { meta: project.meta, data: goldiData };
}

async function markAsInSync(project: Project) {
    await appDataRepository.projects.update(project.id, {
        state: ProjectState.InSync,
        checkSum: md5(await getContentFromAssociatedFile(project))
    });
}

async function getContentFromAssociatedFile(project: Project): Promise<string> {
    if (!project.fileHandle) {
        throw Error("No fileHandle found for project.");
    }
    let file: File;
    try {
        file = await project.fileHandle.getFile();
    } catch (error) {
        throw Error("File not found.", { cause: error });
    }
    return await file.text();
}  