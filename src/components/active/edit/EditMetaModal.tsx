import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Project } from '../../../db/appData';
import { updateMetaData } from '../../../logic/projectService';
import { GoldiMeta } from '../../../types/goldi';

type EditMetaModalProps = {
  show: boolean
  project: Project;
  onFinish: () => void;
}

export default function EditMetaModal(props: EditMetaModalProps) {

  const [updatedGoldiMeta, setUpdatedGoldiMeta] = useState<GoldiMeta>(props.project.meta);

  return (<Modal
    show={props.show}
    centered
    animation={false}
    backdrop="static"
  >
    <Modal.Body>
      <Form>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type='text'
            value={updatedGoldiMeta.title}
            onChange={e => setUpdatedGoldiMeta({
              ...updatedGoldiMeta,
              title: e.target.value
            })} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            type='text'
            value={updatedGoldiMeta.description}
            onChange={e => setUpdatedGoldiMeta({
              ...updatedGoldiMeta,
              description: e.target.value
            })} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Color</Form.Label>
          <Form.Control
            type='color'
            value={updatedGoldiMeta.color}
            onChange={e => setUpdatedGoldiMeta({
              ...updatedGoldiMeta,
              color: e.target.value
            })} />
        </Form.Group>
        <div className="py-2">
          <Button onClick={update}
            variant="outline-dark"
          >
            Apply
          </Button>
          <Button onClick={props.onFinish}
            variant="outline-dark"
            className="mx-2"
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Modal.Body>
  </Modal>
  );

  async function update(): Promise<void> {
    await updateMetaData(props.project, updatedGoldiMeta);
    props.onFinish();
  }
}