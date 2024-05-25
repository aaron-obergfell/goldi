import { Container, Modal } from 'react-bootstrap';
import ButtonWithTextInsideModal from '../../globals/ButtonWithTextInsideModal';

type OnOpenFileNotFoundModalProps = {
  fileName: string | undefined;
  onCancel: () => void;
  onRemoveFileReference: () => void;
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
            onClick={props.onRemoveFileReference}
            buttonText={"Detach"}
            explanation={"This will open the project without the reference to the file. No data is lost. Please don't forget to save the project to another file."}
          />
          <hr />
          <ButtonWithTextInsideModal
            onClick={props.onCancel}
            buttonText={"Cancel"}
            explanation={"This will cancel the opening process."}
          />
        </Container>
      </Modal.Body>
    </Modal>
  );
}