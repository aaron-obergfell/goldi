import { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Project } from '../../db/appData';
import { requestReadWritePermission } from '../../fs/fileHandleHelper';

import { getFileHandleFromFilePicker, newProject } from '../../fs/open';
import { isProjectError, ProjectError, ProjectErrorType } from '../../logic/projectError';
import { checkRecent, createNewProjectForFileHandle, getRecentProjectOrElseUndefined, prepare, removeFileReference } from '../../logic/projectService';
import WaitingModal from '../globals/WaitingModal';
import AheadOfFileModal from './errorModals/AheadOfFileModal';
import CheckSumMismatchModal from './errorModals/CheckSumMismatchModal';
import FileNotFoundModal from './errorModals/FileNotFoundModal';
import PermissionNotGrantedModal from './errorModals/PermissionNotGrantedModal';
import NavBarForInactiveGoldi from './NavBarForInactiveGoldi';
import RecentProjects from './RecentProjects';

type InactiveGoldiProps = {
  setProjectId: (projectId: string | undefined) => void;
}

export default function InactiveGoldi(props: InactiveGoldiProps) {

  const [waitingText, setWaitingText] = useState<string | undefined>(undefined);
  const [projectError, setProjectError] = useState<ProjectError | undefined>(undefined);
  const [unexpectedErrorOccured, setUnexpectedErrorOccured] = useState<boolean>(false);

  useEffect(() => {
    document.title = "Goldi";
  });

  return (
    <>
      <NavBarForInactiveGoldi />
      <Container>
        <div className="text-center">
          <Button onClick={() => openFromFilePicker()} variant="outline-dark" className="my-3" >
            Open
          </Button>
          - - -
          <Button onClick={() => newProject(props.setProjectId)} variant="outline-dark" className="my-3" >
            New
          </Button>
        </div>
        <RecentProjects open={openRecentProject} />
      </Container>
      <WaitingModal text={waitingText}></WaitingModal>
      {
        renderProblemModals()
      }
    </>
  );

  function renderProblemModals(): JSX.Element {
    if (!projectError) {
      return (<></>);
    }
    if (unexpectedErrorOccured) {
      return (
        <>
          <div>We have an unexpected problem</div>
        </>
      );
    }
    switch (projectError.type) {
      case ProjectErrorType.PermissionNotGranted: return (
        <PermissionNotGrantedModal
          fileName={projectError.project.fileHandle?.name}
          onRequestPermission={() => requestPermissionAndOpen(projectError.project)}
          onCancel={abort}
          onRemoveFileReference={() => removeFileRefAndOpen(projectError.project)}
        />
      )
      case ProjectErrorType.FileNotFound: return (
        <FileNotFoundModal
          fileName={projectError.project.fileHandle?.name}
          onCancel={abort}
          onRemoveFileReference={() => removeFileRefAndOpen(projectError.project)}
        />
      )
      case ProjectErrorType.CheckSumMismatch: return (
        <CheckSumMismatchModal
          fileName={projectError.project.fileHandle?.name}
          onCancel={abort}
          onOpenAsNew={() => openAsNew(projectError.project)}
          onOverwrite={() => overwriteAndOpen(projectError.project)}
          onRemoveFileReference={() => removeFileRefAndOpen(projectError.project)}
        />
      )
      case ProjectErrorType.AheadOfFile: return (
        <AheadOfFileModal
          fileName={projectError.project.fileHandle?.name}
          onCancel={abort}
          onOpenAsNew={() => openAsNew(projectError.project)}
          onOverwrite={() => overwriteAndOpen(projectError.project)}
          onContinue={() => props.setProjectId(projectError.project.id)}
        />
      )
    }
    return (<></>);
  }

  async function openRecentProject(project: Project): Promise<void> {
    try {
      await checkRecent(project);
      props.setProjectId(project.id);
    } catch (err: any) {
      if (isProjectError(err)) {
        setProjectError(err)
      } else {
        setUnexpectedErrorOccured(true);
      }
    }
  }

  async function openFromFilePicker(): Promise<void> {
    const fileHandle: FileSystemFileHandle | undefined = await getFileHandleFromFilePicker();
    if (!fileHandle) {
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
    const updatedProject: Project = await removeFileReference(project);
    await openRecentProject(updatedProject);
  }

  async function requestPermissionAndOpen(project: Project): Promise<void> {
    await requestReadWritePermission(project.fileHandle);
    await openRecentProject(project);
  }

  async function overwriteAndOpen(project: Project): Promise<void> {
    try {
      await prepare(project);
      props.setProjectId(project.id);
    } catch (err: any) {
      setUnexpectedErrorOccured(true);
    }
  }

  function abort(): void {
    setProjectError(undefined);
    setUnexpectedErrorOccured(false);
    props.setProjectId(undefined);
  }
}
