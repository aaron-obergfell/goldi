import { Container, Modal } from 'react-bootstrap';
import ButtonWithTextInsideModal from '../../globals/ButtonWithTextInsideModal';

type OnRemoveConfirmationModalProps = {
  conflictText: string;
  confirmationText: string;
  onCancel: () => void;
  onDeleteAnyway: () => void;
}

export default function OnRemoveConfirmationModal(props: OnRemoveConfirmationModalProps) {

  return (
    <Modal
      show={true}
      centered
      animation={false}
      backdrop="static"
    >
      <Modal.Body className="text-center">
        <h6 className='mb-5'>
          {props.conflictText}
        </h6>

        <Container>
          <ButtonWithTextInsideModal
            onClick={props.onDeleteAnyway}
            buttonText={"Delete"}
            explanation={props.confirmationText}
          />
          <hr />
          <ButtonWithTextInsideModal
            onClick={props.onCancel}
            buttonText={"Cancel"}
            explanation={"This will cancel the process."}
          />
        </Container>
      </Modal.Body>
    </Modal>
  );
}