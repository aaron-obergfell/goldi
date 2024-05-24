import { Modal, Spinner } from 'react-bootstrap';
import '../../css/goldi-btn.css';

type WaitingModalProps = {
  text: string | undefined;
}

export default function WaitingModal(props: WaitingModalProps) {

  return (
    <Modal
      show={!!props.text}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      animation={false}
      backdrop="static"
    >
      <Modal.Body className="text-center">
        <Spinner animation="border" />
        <p className="mt-4">
          {props.text}
        </p>
      </Modal.Body>
    </Modal>
  );
}