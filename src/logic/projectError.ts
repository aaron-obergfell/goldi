import { Project } from "../db/appData";

export enum ProjectErrorType {
  FileNotFound = "FILE_NOT_FOUND",
  PermissionNotGranted = "PERMISSION_NOT_GRANTED",
  CheckSumMismatch = "CHECK_SUM_MISMATCH",
  AheadOfFile = "AHEAD_OF_FILE",
  InvalidData = "INVALID_DATA",
  NoFileProvided = "NO_FILE_PROVIDED",
  NoFileHandlePresent = "NO_FILE_HANDLE_PRESENT"
}

export interface ProjectError extends Error {
  name: "ProjectError";
  project: Project;
  type: ProjectErrorType;
}

export function newProjectError(project: Project, type: ProjectErrorType): ProjectError {
  const msg = `An error of type ${type} occured for project with id ${project.id}.`;
  const error = new Error(msg) as ProjectError;
  error.name = "ProjectError";
  error.project = project;
  error.type = type;
  return error;
}

export function isProjectError(error: Error): error is ProjectError {
  return error.name === "ProjectError";
}