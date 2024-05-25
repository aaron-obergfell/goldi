import { Button, Modal, Spinner } from 'react-bootstrap';
import '../../css/goldi-btn.css';

type UnexpectedErrorModalProps = {
    show: boolean;
    onHide: () => void;
}

export default function UnexpectedErrorModal(props: UnexpectedErrorModalProps) {

    return (
        <Modal
            show={props.show}
            size="sm"
            centered
            animation={false}
            backdrop="static"
        >
            <Modal.Body className="text-center">
                <h6>An unexpected error occured</h6>
                <Button
                    onClick={props.onHide}
                    variant="outline-dark"
                    className='my-2'
                >
                    Ok
                </Button>
            </Modal.Body>
        </Modal>
    );
}