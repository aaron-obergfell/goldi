import { Modal, Spinner } from 'react-bootstrap';
import '../../css/goldi-btn.css';

type WaitingModalProps = {
  show: boolean;
}

export default function WaitingModal(props: WaitingModalProps) {

  return (
    <Modal
      show={props.show}
      size="sm"
      centered
      animation={false}
      backdrop="static"
    >
      <Modal.Body className="text-center">
        <Spinner animation="border" />
      </Modal.Body>
    </Modal>
  );
}