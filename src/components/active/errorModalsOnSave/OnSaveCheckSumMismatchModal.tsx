import { Container, Modal } from 'react-bootstrap';
import ButtonWithTextInsideModal from '../../globals/ButtonWithTextInsideModal';

type OnSaveCheckSumMismatchModalProps = {
  fileName: string | undefined;
  onSaveAs: () => void;
  onCancel: () => void;
}

export default function OnSaveCheckSumMismatchModal(props: OnSaveCheckSumMismatchModalProps) {

  return (
    <Modal
      show={true}
      centered
      animation={false}
      backdrop="static"
    >
      <Modal.Body className="text-center">
        <h6 className='mb-5'>
          Apparently, the file '{props.fileName}' was modified by another process in the meantime.
          How would you like to proceed?
        </h6>
        <Container>
          <ButtonWithTextInsideModal
            onClick={props.onSaveAs}
            buttonText={"Save as"}
            explanation={"Choose another file for saving your data."}
          />
          <hr />
          <ButtonWithTextInsideModal
            onClick={props.onCancel}
            buttonText={"Cancel"}
            explanation={"Go back to project."}
          />
        </Container>
      </Modal.Body>
    </Modal>
  );
}