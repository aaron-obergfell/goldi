import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { GoldiMeta } from '../types/goldi.js';
import Form from 'react-bootstrap/Form';

type GoldiEditMetaProps = {
  currentGoldiMeta: GoldiMeta;
  onUpdate: (updatedGoldiMeta) => void;
}

export default function GoldiEditMeta(props: GoldiEditMetaProps) {

  const [updatedGoldiMeta, setUpdatedGoldiMeta] = useState<GoldiMeta>(props.currentGoldiMeta);

  return (
    <Form style={{ width: '300px' }}>
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type='text'
          value={updatedGoldiMeta.title}
          onChange={e => setUpdatedGoldiMeta({
            ...updatedGoldiMeta,
            title: e.target.value
          })}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control
          type='text'
          value={updatedGoldiMeta.description}
          onChange={e => setUpdatedGoldiMeta({
            ...updatedGoldiMeta,
            description: e.target.value
          })}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Color</Form.Label>
        <Form.Control
          type='color'
          value={updatedGoldiMeta.color}
          onChange={e => setUpdatedGoldiMeta({
            ...updatedGoldiMeta,
            color: e.target.value
          })}
        />
      </Form.Group>
      <Button onClick={() => props.onUpdate(updatedGoldiMeta)} variant="info">
        Update
      </Button>
    </Form>
  );
}