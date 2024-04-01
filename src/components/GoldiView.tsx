import { useLiveQuery } from 'dexie-react-hooks';
import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { projectDataRepository } from '../db/projectData';
import { GoldiMeta } from '../types/goldi.js';

type GoldiViewProps = {
  projectId: string;
  goldiMeta: GoldiMeta;
}

export default function GoldiView(props: GoldiViewProps) {

  const columns = useLiveQuery(() => projectDataRepository(props.projectId).columns.orderBy("position").filter(column => column.visible).toArray());

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
      {
        columns ? (
          <Table responsive>
            <thead>
              <tr>
                <th>#</th>
                {columns.map((column) => (
                  <th key={column.id}>{column.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                {Array.from({ length: columns.length }).map((_, index) => (
                  <td key={index}>Table cell {index}</td>
                ))}
              </tr>
              <tr>
                <td>2</td>
                {Array.from({ length: columns.length }).map((_, index) => (
                  <td key={index}>Table cell {index}</td>
                ))}
              </tr>
              <tr>
                <td>3</td>
                {Array.from({ length: columns.length }).map((_, index) => (
                  <td key={index}>Table cell {index}</td>
                ))}
              </tr>
            </tbody>
          </Table>
        ) : (
          "loading"
        )
      }

    </>
  );
}