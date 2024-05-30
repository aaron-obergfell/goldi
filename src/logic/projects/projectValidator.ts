import { Project, ProjectState } from "../../db/appData";
import md5 from 'md5';
import { queryReadPermission, queryReadWritePermission } from "../../fs/fileHandleHelper";
import { newProjectError, ProjectErrorType } from "./projectError";

export enum ProjectValidationTrigger {
    OpenRecent,
    RemoveRecent,
    Close,
    Save
}

export async function validate(project: Project, trigger: ProjectValidationTrigger): Promise<void> {
    switch (trigger) {
        case ProjectValidationTrigger.OpenRecent:
            if (project.fileHandle === undefined) {
                return;
            }
            await validateReadFile(project);
            validateProjectStateNotAheadOfFile(project);
            await validateCheckSum(project);
            return;
        case ProjectValidationTrigger.RemoveRecent:
            validateFileHandleIsPresent(project);
            await validateReadFile(project);
            validateProjectStateNotAheadOfFile(project);
            await validateCheckSum(project);
            return;
        case ProjectValidationTrigger.Save:
            await validateReadWriteFile(project);
            await validateCheckSum(project);
            return;
    }
}

function validateFileHandleIsPresent(project: Project): void {
    if (project.fileHandle === undefined) {
        throw newProjectError(project, ProjectErrorType.NoFileHandlePresent);
    }
}

async function validateReadFile(project: Project): Promise<void> {
    if (!project.fileHandle) {
        throw new Error("fileHandle was expected");
    }
    if ("granted" !== await queryReadPermission(project.fileHandle)) {
        throw newProjectError(project, ProjectErrorType.PermissionNotGranted);
    }
    try {
        await project.fileHandle.getFile();
    } catch (error) {
        throw newProjectError(project, ProjectErrorType.FileNotFound);
    }
}

async function validateReadWriteFile(project: Project): Promise<void> {
    if (!project.fileHandle) {
        throw new Error("fileHandle was expected");
    }
    if ("granted" !== await queryReadWritePermission(project.fileHandle)) {
        throw newProjectError(project, ProjectErrorType.PermissionNotGranted);
    }
    try {
        await project.fileHandle.getFile();
    } catch (error) {
        throw newProjectError(project, ProjectErrorType.FileNotFound);
    }
}

function validateProjectStateNotAheadOfFile(project: Project): void {
    if (project.state === ProjectState.AheadOfFile) {
        throw newProjectError(project, ProjectErrorType.AheadOfFile);
    }
}

async function validateCheckSum(project: Project): Promise<void> {
    if (!project.fileHandle) {
        throw new Error("fileHandle was expected");
    }
    let file: File;
    try {
        file = await project.fileHandle.getFile();
    } catch (error) {
        throw new Error("file was expected");
    }
    if (md5(await file.text()) !== project.checkSum) {
        throw newProjectError(project, ProjectErrorType.CheckSumMismatch);
    }
}