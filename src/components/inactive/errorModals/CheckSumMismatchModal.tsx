import { Container, Modal } from 'react-bootstrap';
import ButtonWithTextInsideModal from '../../globals/ButtonWithTextInsideModal';

type CheckSumMismatchModalProps = {
  fileName: string | undefined;
  onOpenAsNew: () => void;
  onCancel: () => void;
  onOverwrite: () => void;
  onRemoveFileReference: () => void;
}

export default function CheckSumMismatchModal(props: CheckSumMismatchModalProps) {

  return (
    <Modal
      show={true}
      centered
      animation={false}
      backdrop="static"
    >
      <Modal.Body className="text-center">
        <h6 className='mb-5'>
          Apparently, the file '{props.fileName}' was modified in the meantime.
          How would you like to proceed?
        </h6>
        <Container>
          <ButtonWithTextInsideModal
            onClick={props.onOpenAsNew}
            buttonText={"Parallelize"}
            explanation={"The project will be newly loaded from the file. The other version will be available as an unsaved draft."}
          />
          <hr />
          <ButtonWithTextInsideModal
            onClick={props.onOverwrite}
            buttonText={"Overwrite"}
            explanation={"This will overwrite the version of the browser storage by the file data."}
          />
          <hr />
          <ButtonWithTextInsideModal
            onClick={props.onCancel}
            buttonText={"cancel"}
            explanation={"This will cancel the opening process."}
          />
        </Container>
      </Modal.Body>
    </Modal>
  );
}