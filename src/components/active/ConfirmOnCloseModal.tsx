import { Container, Modal } from 'react-bootstrap';
import { ProjectState } from '../../db/appData';
import ButtonWithTextInsideModal from '../globals/ButtonWithTextInsideModal';

type ConfirmOnCloseModalProps = {
  show: boolean
  state: ProjectState;
  onClose: () => void;
  onCancel: () => void;
}

export default function ConfirmOnCloseModal(props: ConfirmOnCloseModalProps) {

  return (
    <Modal
      show={props.show}
      centered
      animation={false}
      backdrop="static"
    >
      <Modal.Body className="text-center">
        <h6 className='mb-5'>
          {warningText()}

          Do you really want to close this project?
        </h6>
        <Container>
          <ButtonWithTextInsideModal
            onClick={props.onClose}
            buttonText={"Close"}
            explanation={"Close the project."}
          />
          <hr />
          <ButtonWithTextInsideModal
            onClick={props.onCancel}
            buttonText={"Cancel"}
            explanation={"Stay on project page."}
          />
        </Container>
      </Modal.Body>
    </Modal>
  );

  function warningText(): string {
    switch (props.state) {
      case ProjectState.Empty:
        return "You haven't changed anything and the project is still empty.";
      case ProjectState.Draft:
        return "You haven't saved your changes to a file.";
      case ProjectState.AheadOfFile:
        return "You haven't already saved your latest changes to the file.";
      default:
        return "Hm :/ That's weired...";
    }
  }

  
}