import { Stack, Tab, Tabs } from 'react-bootstrap';
import saveIcon from '../../icons/save.svg'
import saveAsIcon from '../../icons/save_as.svg'
import closeIcon from '../../icons/close.svg'
import SmallGoldiButton from '../globals/SmallGoldiButton';
import { GoldiMode } from './ActiveGoldi';
import { Project, ProjectState } from '../../db/appData';
import { ProjectValidationTrigger, validate } from '../../logic/projects/projectValidator';
import { addFileHandle, removeWithoutCheck, saveToFile, saveToOtherFile } from '../../logic/projects/projectService';
import { useState } from 'react';
import { isProjectError, ProjectError, ProjectErrorType } from '../../logic/projects/projectError';
import UnexpectedErrorModal from '../globals/UnexpectedErrorModal';
import OnSavePermissionNotGrantedModal from './errorModalsOnSave/OnSavePermissionNotGrantedModal';
import OnSaveFileNotFoundModal from './errorModalsOnSave/OnSaveFileNotFoundModal';
import OnSaveCheckSumMismatchModal from './errorModalsOnSave/OnSaveCheckSumMismatchModal';
import WaitingModal from '../globals/WaitingModal';
import { getFileHandleFromSavePicker, requestReadWritePermission } from '../../fs/fileHandleHelper';
import ConfirmOnCloseModal from './ConfirmOnCloseModal';

type NavBarProps = {
  project: Project;
  setGoldiMode: (mode: GoldiMode) => void;
  onClose: () => void;
}

export default function NavBarForActiveGoldi(props: NavBarProps) {

  const [waiting, setWaiting] = useState<boolean>(false);
  const [onSaveProjectError, setOnSaveProjectError] = useState<ProjectError | undefined>(undefined);
  const [unexpectedErrorOccured, setUnexpectedErrorOccured] = useState<boolean>(false);
  const [letUserConfirmClosing, setLetUserConfirmClosing] = useState<boolean>(false);

  return (
    <>
      <Stack direction="horizontal" gap={2}>
        <SmallGoldiButton
          active={props.project.state !== ProjectState.InSync}
          onClick={props.project.fileHandle ? save : saveAs}
          icon={saveIcon}
          tooltipText={'Save'}
        />

        <SmallGoldiButton
          active={!!props.project.fileHandle}
          onClick={saveAs}
          icon={saveAsIcon}
          tooltipText={'Save as'}
        />

        <div className='ms-auto'>
          <SmallGoldiButton
            active={true}
            onClick={props.project.state === ProjectState.InSync ? () => close() : () => setLetUserConfirmClosing(true)}
            icon={closeIcon}
            tooltipText={'Close'}
          />
        </div>
      </Stack>

      <Tabs
        onSelect={(eventKey, _e) => {
          switch (eventKey) {
            case "view":
              props.setGoldiMode(GoldiMode.View);
              break;
            case "edit":
              props.setGoldiMode(GoldiMode.Edit);
              break;
          }
        }}
      >
        <Tab eventKey={"view"} title="Hauptansicht" />
        <Tab eventKey={"edit"} title="Bearbeitungsmodus" />
      </Tabs>
      <WaitingModal show={waiting} />
      <ConfirmOnCloseModal
        show={letUserConfirmClosing}
        state={props.project.state}
        onCancel={clearAllModals}
        onClose={close}
      />
      {renderProblemModals()}
    </>
  );

  function renderProblemModals(): JSX.Element {
    if (unexpectedErrorOccured) {
      return (
        <UnexpectedErrorModal
          show={unexpectedErrorOccured}
          onHide={clearAllModals}
        />
      );
    }
    if (onSaveProjectError) {
      switch (onSaveProjectError.type) {
        case ProjectErrorType.PermissionNotGranted: return (
          <OnSavePermissionNotGrantedModal
            fileName={onSaveProjectError.project.fileHandle?.name}
            onRequestPermission={() => requestPermissionAndSave()}
            onCancel={clearAllModals}
          />
        )
        case ProjectErrorType.FileNotFound: return (
          <OnSaveFileNotFoundModal
            fileName={onSaveProjectError.project.fileHandle?.name}
            onCancel={clearAllModals}
            onSaveAs={saveAs}
          />
        )
        case ProjectErrorType.CheckSumMismatch: return (
          <OnSaveCheckSumMismatchModal
            fileName={onSaveProjectError.project.fileHandle?.name}
            onCancel={clearAllModals}
            onSaveAs={saveAs}
          />
        )
      }
    }
    return (<></>);
  }

  function clearAllModals(): void {
    setOnSaveProjectError(undefined);
    setUnexpectedErrorOccured(false);
    setWaiting(false);
    setLetUserConfirmClosing(false);
  }

  async function requestPermissionAndSave(): Promise<void> {
    clearAllModals();
    setWaiting(true);
    await requestReadWritePermission(props.project.fileHandle);
    await save();
    clearAllModals();
  }


  async function save(): Promise<void> {
    setWaiting(true);
    try {
      await validate(props.project, ProjectValidationTrigger.Save);
      await saveToFile(props.project);
      clearAllModals();
    } catch (err: any) {
      if (isProjectError(err)) {
        setOnSaveProjectError(err);
      } else {
        console.log(err);
        setUnexpectedErrorOccured(true);
      }
    }
  }

  async function saveAs(): Promise<void> {
    setWaiting(true);
    let fileHandle: FileSystemFileHandle;
    try {
      fileHandle = await getFileHandleFromSavePicker();
    } catch (err: any) {
      clearAllModals();
      return;
    }
    if (props.project.fileHandle) {
      await saveToOtherFile(props.project, fileHandle);
    } else {
      const projectWithFileHandle: Project = await addFileHandle(props.project, fileHandle);
      await saveToFile(projectWithFileHandle);
    }
    clearAllModals();
  }

  async function close(): Promise<void> {
    if (props.project.state === ProjectState.Empty) {
      await removeWithoutCheck(props.project);
    }
    props.onClose();
  }
}