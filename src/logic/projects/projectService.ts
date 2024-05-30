import { appDataRepository, Project, ProjectState } from "../../db/appData";
import { v4 as uuidv4 } from 'uuid';
import { defaultMeta, GoldiJSON, GoldiMeta } from "../../types/goldi";
import md5 from 'md5';
import { queryReadPermission } from "../../fs/fileHandleHelper";
import { newProjectError, ProjectErrorType } from "./projectError";
import { projectDataRepository } from "../../db/projectData";

export async function getRecentProjectOrElseUndefined(fileHandle: FileSystemFileHandle): Promise<Project | undefined> {
    let allProjects: Project[] = await appDataRepository.projects.toArray();
    for (var project of allProjects) {
        if (project.fileHandle && await fileHandle.isSameEntry(project.fileHandle)) {
            return project;
        }
    }
    return undefined;
}

export const createNewProjectForFileHandle: (fH: FileSystemFileHandle) => Promise<Project> = async (fH) => {
    const newProject: Project = {
        id: uuidv4(),
        fileHandle: fH,
        meta: defaultMeta,
        checkSum: undefined,
        state: ProjectState.Empty
    }
    await appDataRepository.projects.add(newProject);
    return newProject;
}

export const createNewProjectWithoutFileHandle: () => Promise<Project> = async () => {
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
    if (!project.fileHandle) {
        throw Error("No fileHandle found for project.");
    }
    let file: File;
    try {
        file = await project.fileHandle.getFile();
    } catch (error) {
        throw Error("File not found.", { cause: error });
    }
    const fileContent = await file.text();
    if (false) {
        throw newProjectError(project, ProjectErrorType.InvalidData);
    }
    const goldiJson: GoldiJSON = JSON.parse(fileContent);
    const projectUpdateSpec = {
        meta: goldiJson.meta,
        checkSum: await getCheckSum(file),
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
    await appDataRepository.projects.update(project.id, {
        meta: newMetaData,
        state: ProjectState.AheadOfFile
    });
}

export async function removeWithoutCheck(project: Project) {
    await projectDataRepository(project.id).delete();
    await appDataRepository.projects.delete(project.id);
}