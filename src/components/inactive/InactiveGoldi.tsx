import { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Project } from '../../db/appData';
import { requestReadPermission } from '../../fs/fileHandleHelper';

import { getFileHandleFromFilePicker } from '../../fs/open';
import { isProjectError, ProjectError, ProjectErrorType } from '../../logic/projects/projectError';
import { createNewProjectForFileHandle, createNewProjectWithoutFileHandle, getRecentProjectOrElseUndefined, prepare, removeFileReference, removeWithoutCheck } from '../../logic/projects/projectService';
import { ProjectValidationTrigger, validate } from '../../logic/projects/projectValidator';
import UnexpectedErrorModal from '../globals/UnexpectedErrorModal';
import WaitingModal from '../globals/WaitingModal';
import OnOpenAheadOfFileModal from './errorModalsOnOpen/OnOpenAheadOfFileModal';
import OnOpenCheckSumMismatchModal from './errorModalsOnOpen/OnOpenCheckSumMismatchModal';
import OnOpenFileNotFoundModal from './errorModalsOnOpen/OnOpenFileNotFoundModal';
import OnOpenPermissionNotGrantedModal from './errorModalsOnOpen/OnOpenPermissionNotGrantedModal';
import OnRemoveConfirmationModal from './errorModalsOnOpen/OnRemoveConfirmationModal';
import NavBarForInactiveGoldi from './NavBarForInactiveGoldi';
import RecentProjects from './RecentProjects';

type InactiveGoldiProps = {
  setProjectId: (projectId: string | undefined) => void;
}

export default function InactiveGoldi(props: InactiveGoldiProps) {

  const [waiting, setWaiting] = useState<boolean>(false);
  const [projectError, setProjectError] = useState<ProjectError | undefined>(undefined);
  const [onRemoveProjectError, setOnRemoveProjectError] = useState<ProjectError | undefined>(undefined);
  const [unexpectedErrorOccured, setUnexpectedErrorOccured] = useState<boolean>(false);

  useEffect(() => {
    document.title = "Goldi";

    if ('launchQueue' in window) {
      window.launchQueue.setConsumer(async (launchParams: LaunchParams) => {
        if (launchParams.files.length) {
          await openByFileHandle(launchParams.files[0]);
        };
      });
    }
  });

  useEffect(() => {
    if (projectError || unexpectedErrorOccured || onRemoveProjectError) {
      setWaiting(false);
    }
  }, [projectError, onRemoveProjectError, unexpectedErrorOccured]);

  return (
    <>
      <NavBarForInactiveGoldi />
      <Container>
        <div className="text-center">
          <Button onClick={() => openFromFilePicker()} variant="outline-dark" className="my-3" >
            Open
          </Button>
          - - -
          <Button onClick={() => openNew()} variant="outline-dark" className="my-3" >
            New
          </Button>
        </div>
        <RecentProjects
          onOpen={openRecentProject}
          onRemove={removeRecentProject}
        />
      </Container>
      <WaitingModal show={waiting} />
      {
        renderProblemModals()
      }
    </>
  );

  function renderProblemModals(): JSX.Element {
    if (unexpectedErrorOccured) {
      return (
        <UnexpectedErrorModal
          show={unexpectedErrorOccured}
          onHide={abort}
        />
      );
    }
    if (projectError) {
      switch (projectError.type) {
        case ProjectErrorType.PermissionNotGranted: return (
          <OnOpenPermissionNotGrantedModal
            fileName={projectError.project.fileHandle?.name}
            onRequestPermission={() => requestPermissionAndOpen(projectError.project)}
            onCancel={abort}
            onRemoveFileReference={() => removeFileRefAndOpen(projectError.project)}
          />
        )
        case ProjectErrorType.FileNotFound: return (
          <OnOpenFileNotFoundModal
            fileName={projectError.project.fileHandle?.name}
            onCancel={abort}
            onRemoveFileReference={() => removeFileRefAndOpen(projectError.project)}
          />
        )
        case ProjectErrorType.CheckSumMismatch: return (
          <OnOpenCheckSumMismatchModal
            fileName={projectError.project.fileHandle?.name}
            onCancel={abort}
            onOpenAsNew={() => openAsNew(projectError.project)}
            onOverwrite={() => overwriteAndOpen(projectError.project)}
            onRemoveFileReference={() => removeFileRefAndOpen(projectError.project)}
          />
        )
        case ProjectErrorType.AheadOfFile: return (
          <OnOpenAheadOfFileModal
            fileName={projectError.project.fileHandle?.name}
            onCancel={abort}
            onOpenAsNew={() => openAsNew(projectError.project)}
            onOverwrite={() => overwriteAndOpen(projectError.project)}
            onContinue={() => props.setProjectId(projectError.project.id)}
          />
        )
      }
    }
    if (onRemoveProjectError) {
      let conflictText: string, confirmationText: string;
      switch (onRemoveProjectError.type) {
        case ProjectErrorType.PermissionNotGranted:
          conflictText = "The app has no permission to read the file. How would you like to proceed?";
          confirmationText = "This will remove the file. App data is removed. You can open the project from the file.";
          break;
        case ProjectErrorType.FileNotFound:
          conflictText = "The app couldn't find the file.";
          confirmationText = "This will remove the file. App data is removed. You can open the project from the file.";
          break;
        case ProjectErrorType.CheckSumMismatch:
          conflictText = "ok";
          confirmationText = "confirm";
          break;
        case ProjectErrorType.AheadOfFile:
          conflictText = "You have unsaved changes. Do you want to remove anyway?";
          confirmationText = "You unsaved changes will be lost.";
          break;
        case ProjectErrorType.NoFileHandlePresent:
          conflictText = "This is an unsaved draft. Do you want to remove anyway?";
          confirmationText = "This will remove the project and all data is lost.";
          break;
        default:
          conflictText = "Some unexpected error occured.";
          confirmationText = "Do you want to delete the project anyway?";
      }
      return (
        <OnRemoveConfirmationModal
          conflictText={conflictText}
          confirmationText={confirmationText}
          onCancel={abort}
          onDeleteAnyway={() => removeAnyway(onRemoveProjectError.project)}
        />
      )
    }
    return (<></>);
  }

  async function openRecentProject(project: Project): Promise<void> {
    setWaiting(true);
    try {
      await validate(project, ProjectValidationTrigger.OpenRecent);
      props.setProjectId(project.id);
    } catch (err: any) {
      if (isProjectError(err)) {
        setProjectError(err)
      } else {
        setUnexpectedErrorOccured(true);
      }
    }
  }

  async function removeRecentProject(project: Project): Promise<void> {
    setWaiting(true);
    try {
      await validate(project, ProjectValidationTrigger.RemoveRecent);
      await removeWithoutCheck(project);
      setWaiting(false);
    } catch (err: any) {
      if (isProjectError(err)) {
        setOnRemoveProjectError(err)
      } else {
        setUnexpectedErrorOccured(true);
      }
    }
  }

  async function removeAnyway(project: Project): Promise<void> {
    setWaiting(true);
    try {
      await removeWithoutCheck(project);
      abort();
    } catch (err: any) {
      setUnexpectedErrorOccured(true);
    }
  }


  async function openFromFilePicker(): Promise<void> {
    setWaiting(true);
    openByFileHandle(await getFileHandleFromFilePicker());
  }

  async function openByFileHandle(fileHandle: FileSystemFileHandle | undefined): Promise<void> {
    if (!fileHandle) {
      setWaiting(false);
      return;
    }
    let project = await getRecentProjectOrElseUndefined(fileHandle);
    if (project) {
      openRecentProject(project);
      return;
    }
    project = await createNewProjectForFileHandle(fileHandle);
    try {
      await prepare(project);
      props.setProjectId(project.id);
    } catch (err: any) {
      if (isProjectError(err)) {
        setProjectError(err)
      } else {
        setUnexpectedErrorOccured(true);
      }
    }
  }

  async function openAsNew(project: Project): Promise<void> {
    setWaiting(true);
    if (!project.fileHandle) {
      setUnexpectedErrorOccured(true);
      return;
    }

    const newProject = await createNewProjectForFileHandle(project.fileHandle);
    try {
      await removeFileReference(project);
      await prepare(newProject);
      props.setProjectId(newProject.id);
    } catch (err: any) {
      if (isProjectError(err)) {
        setProjectError(err)
      } else {
        setUnexpectedErrorOccured(true);
      }
    }
  }

  async function removeFileRefAndOpen(project: Project): Promise<void> {
    setWaiting(true);
    const updatedProject: Project = await removeFileReference(project);
    await openRecentProject(updatedProject);
  }

  async function requestPermissionAndOpen(project: Project): Promise<void> {
    setWaiting(true);
    await requestReadPermission(project.fileHandle);
    await openRecentProject(project);
  }

  async function overwriteAndOpen(project: Project): Promise<void> {
    setWaiting(true);
    try {
      await prepare(project);
      props.setProjectId(project.id);
    } catch (err: any) {
      setUnexpectedErrorOccured(true);
    }
  }

  async function openNew(): Promise<void> {
    setWaiting(true);
    const newProject: Project = await createNewProjectWithoutFileHandle();
    props.setProjectId(newProject.id);
  }

  function abort(): void {
    setWaiting(false);
    setProjectError(undefined);
    setOnRemoveProjectError(undefined);
    setUnexpectedErrorOccured(false);
    props.setProjectId(undefined);
  }
}
