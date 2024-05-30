import { Container, Modal } from 'react-bootstrap';
import ButtonWithTextInsideModal from '../../globals/ButtonWithTextInsideModal';

type OnOpenPermissionNotGrantedModalProps = {
  fileName: string | undefined;
  onRequestPermission: () => void;
  onCancel: () => void;
}

export default function OnOpenPermissionNotGrantedModal(props: OnOpenPermissionNotGrantedModalProps) {

  return (
    <Modal
      show={true}
      centered
      animation={false}
      backdrop="static"
    >
      <Modal.Body className="text-center">
        <h6 className='mb-5'>
          The browser has not the rights to edit the file '{props.fileName}'.
          How would you like to proceed?
        </h6>

        <Container>
          <ButtonWithTextInsideModal
            onClick={props.onRequestPermission}
            buttonText={"Allow"}
            explanation={"The browser will ask you to allow editing the file. In case you grant the requested permission the project will be saved."}
          />
          <hr />
          <ButtonWithTextInsideModal
            onClick={props.onCancel}
            buttonText={"Cancel"}
            explanation={"Go back."}
          />
        </Container>
      </Modal.Body>
    </Modal>
  );
}