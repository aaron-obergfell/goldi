import { useState } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { Project } from '../../../db/appData';
import { GoldiColumn, GoldiColumnType } from '../../../db/projectData';
import { addColumn } from '../../../logic/columns/columnsService';

type AddColumnModalProps = {
  project: Project;
  onFinish: () => void;
}

enum ColumnCreationState {
  NameAndDescription,
  Type
}

const columnToStartWith: GoldiColumn = {
  id: undefined,
  name: '',
  description: '',
  type: GoldiColumnType.Text,
  position: 0,
  visible: true
}

export default function AddColumnModal(props: AddColumnModalProps) {

  const [columnCreationState, setColumnCreationState] = useState<ColumnCreationState>(ColumnCreationState.NameAndDescription);
  const [newColumn, setNewColumn] = useState<GoldiColumn>(columnToStartWith);


  return (
    <Modal
      show={true}
      centered
      animation={false}
      backdrop="static"
    >
      <Modal.Body>
        <h4>New Column</h4>
        <div style={{ minHeight: '300px' }}>
          {determinePartial()}
        </div>
        <Container>
          <Row>
            <Col>
              <Button onClick={props.onFinish}
                style={{width: '100%'}}
                variant="outline-dark"
              >
                Cancel
              </Button>
            </Col>
            <Col>
              <Button onClick={goToPreviousStep}
                style={{width: '100%'}}
                variant="outline-dark"
                disabled={!canGoBack()}
              >
                {'<<'}
              </Button>
            </Col>
            <Col>
              <Button onClick={goToNextStep}
                style={{width: '100%'}}
                variant="outline-dark"
                disabled={!canGoToNext()}
              >
                {'>>'}
              </Button>
            </Col>
            <Col>
              <Button onClick={save}
                style={{width: '100%'}}
                variant="outline-dark"
                disabled={!canFinish()}
              >
                Save
              </Button>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );

  function canGoBack(): boolean {
    return columnCreationState === ColumnCreationState.Type;
  }

  function canGoToNext(): boolean {
    return columnCreationState === ColumnCreationState.NameAndDescription;
  }

  function canFinish(): boolean {
    return columnCreationState === ColumnCreationState.Type && newColumn.name !== "";
  }

  function goToPreviousStep(): void {
    if (columnCreationState === ColumnCreationState.Type) {
      setColumnCreationState(ColumnCreationState.NameAndDescription);
      return;
    }
  }

  function goToNextStep(): void {
    if (columnCreationState === ColumnCreationState.NameAndDescription) {
      setColumnCreationState(ColumnCreationState.Type);
      return;
    }
  }

  function determinePartial(): JSX.Element {
    switch (columnCreationState) {
      case ColumnCreationState.NameAndDescription: return (
        <>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              value={newColumn.name}
              onChange={e => setNewColumn({ ...newColumn, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={newColumn.description}
              onChange={e => setNewColumn({ ...newColumn, description: e.target.value })}
            />
          </Form.Group>
        </>
      )

      case ColumnCreationState.Type: return (
        <Form.Group>
          <Form.Label>Typ</Form.Label>
          <Form.Select
            value={newColumn.type}
            onChange={e => setNewColumn({ ...newColumn, type: e.target.value as GoldiColumnType })}
          >
            {Object.values(GoldiColumnType).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      )
      default: return (<></>);
    }
  }

  async function save(): Promise<void> {
    await addColumn(newColumn, props.project);
    props.onFinish();
  }
}