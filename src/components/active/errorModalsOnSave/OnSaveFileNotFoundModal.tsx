import { Container, Modal } from 'react-bootstrap';
import ButtonWithTextInsideModal from '../../globals/ButtonWithTextInsideModal';

type OnOpenFileNotFoundModalProps = {
  fileName: string | undefined;
  onCancel: () => void;
  onSaveAs: () => void;
}

export default function OnOpenFileNotFoundModal(props: OnOpenFileNotFoundModalProps) {

  return (
    <Modal
      show={true}
      centered
      animation={false}
      backdrop="static"
    >
      <Modal.Body className="text-center">
        <h6 className='mb-5'>
          The file '{props.fileName}' could not be found.
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