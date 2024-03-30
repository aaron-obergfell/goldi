import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { GoldiMeta } from '../types/goldi.js';

type GoldiViewProps = {
  projectId: string;
  goldiMeta: GoldiMeta;
}

export default function GoldiView(props: GoldiViewProps) {

  return (
    <>
      <h1>{props.goldiMeta.title}</h1>
      <div style={{
        backgroundColor: props.goldiMeta.color,
        width: '100%',
        height: 5,
      }}>
      </div>
      <p>
        {props.goldiMeta.description}
      </p>
    </>
  );
}