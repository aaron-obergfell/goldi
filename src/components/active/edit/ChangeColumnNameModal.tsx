import { useState } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { Project } from '../../../db/appData';
import { GoldiColumn, GoldiColumnType } from '../../../db/projectData';
import { addColumn, updateColumn } from '../../../logic/columns/columnsService';

type ChangeColumnNameModalProps = {
  project: Project;
  column: GoldiColumn;
  onFinish: () => void;
}

export default function ChangeColumnNameModal(props: ChangeColumnNameModalProps) {

  const [newName, setNewName] = useState<string>(props.column.name);
  const [newDescription, setNewDescription] = useState<string>(props.column.description);


  return (
    <Modal
      show={true}
      centered
      animation={false}
      backdrop="static"
    >
      <Modal.Body>
        <h4>Change</h4>
        <div style={{ minHeight: '300px' }}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
            />
          </Form.Group>
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
                disabled={!isSomethingChanged()}
              >
                Save
              </Button>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );

  function isSomethingChanged(): boolean {
    return newName !== props.column.name || newDescription !== props.column.description;
  }

  async function save(): Promise<void> {
    await updateColumn(props.project, props.column, newName, newDescription);
    props.onFinish();
  }
}