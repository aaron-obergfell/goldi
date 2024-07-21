import { useState } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { Project } from '../../../db/appData';
import { GoldiColumn, GoldiValue } from '../../../db/projectData';
import { addValue } from '../../../logic/values/valueService';

type AddValueModalProps = {
  project: Project;
  column: GoldiColumn;
  onFinish: () => void;
}

export default function AddValueModal(props: AddValueModalProps) {

  const valueToStartWith: GoldiValue = {
    id: undefined,
    value: "",
    columnId: props.column.id!,
    color: "#000000",
    bgColor: "#ffffff"
  }

  const [newValue, setNewValue] = useState<GoldiValue>(valueToStartWith);


  return (
    <Modal
      show={true}
      centered
      animation={false}
      backdrop="static"
    >
      <Modal.Body>
        <h4>New value for column '{props.column.name}'</h4>
        <Form>
          <Form.Group className='py-2'>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type='text'
              value={newValue.value}
              onChange={e => setNewValue({
                ...newValue,
                value: e.target.value
              })}
            />
          </Form.Group>
          <Form.Group className='py-2'>
            <Form.Label>Schriftfarbe</Form.Label>
            <Form.Control
              type='color'
              value={newValue.color}
              onChange={e => setNewValue({
                ...newValue,
                color: e.target.value
              })}
            />
          </Form.Group>
          <Form.Group className='py-2'>
            <Form.Label>Hintergrund</Form.Label>
            <Form.Control
              type='color'
              value={newValue.bgColor}
              onChange={e => setNewValue({
                ...newValue,
                bgColor: e.target.value
              })}
            />
          </Form.Group>
        </Form>
        <div className='my-3'>
          <h4>Preview</h4>
          <span
            className='p-2 rounded'
            style={{
              color: newValue.color,
              backgroundColor: newValue.bgColor
            }}
          >
            {newValue.value}
          </span>
        </div>
        <Container>
          <Row>
            <Col>
              <Button onClick={props.onFinish}
                style={{ width: '100%' }}
                variant="outline-dark"
              >
                Cancel
              </Button>
            </Col>
            <Col />
            <Col />
            <Col>
              <Button onClick={save}
                style={{ width: '100%' }}
                variant="outline-dark"
                disabled={false}
              >
                Save
              </Button>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );

  async function save(): Promise<void> {
    addValue(newValue, props.project);
    props.onFinish();
  }
}