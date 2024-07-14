import { useState } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { Project } from '../../../db/appData';
import { GoldiColumn, GoldiColumnType } from '../../../db/projectData';
import { addColumn, deleteColumn, updateColumn } from '../../../logic/columns/columnsService';

type ColumnDeleteConfirmationModalProps = {
  project: Project;
  column: GoldiColumn;
  onFinish: () => void;
}

export default function ColumnDeleteConfirmationModal(props: ColumnDeleteConfirmationModalProps) {

  return (
    <Modal
      show={true}
      centered
      animation={false}
      backdrop="static"
    >
      <Modal.Body>
        <h4>Really?</h4>
        <p>
          Alle Werte dieser Tabelle werden gelöscht!
        </p>
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
            <Col>
              <Button onClick={confirm}
                style={{ width: '100%' }}
                variant="outline-dark"
              >
                Confirm
              </Button>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );

  async function confirm(): Promise<void> {
    await deleteColumn(props.project, props.column);
    props.onFinish();
  }
}