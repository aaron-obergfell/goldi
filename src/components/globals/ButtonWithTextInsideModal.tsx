import { Button, Col, Row } from 'react-bootstrap';

type ButtonWithTextInsideModalProps = {
  onClick: () => void;
  buttonText: string;
  explanation: string;
}

export default function ButtonWithTextInsideModal(props: ButtonWithTextInsideModalProps) {

  return (
    <Row>
      <Col xs={6} md={4}>
        <Button
          onClick={props.onClick}
          variant="outline-dark"
          className='w-100'
        >
          {props.buttonText}
        </Button>
      </Col>
      <Col xs={6} md={8} className="text-start">
        {props.explanation}
      </Col>
    </Row>
  );
}