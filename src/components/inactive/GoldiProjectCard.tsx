import { Button, Card, Col } from 'react-bootstrap';
import Stack from 'react-bootstrap/Stack';

import { Project, ProjectState } from '../../db/appData';
import closeIcon from '../../icons/close.svg'
import GoldiColorBar from '../globals/GoldiColorBar';
import SmallGoldiButton from '../globals/SmallGoldiButton';
type GoldiProjectCardProps = {
  project: Project;
  onOpen: () => void;
  onRemove: () => void;
}

export default function GoldiProjectCard(props: GoldiProjectCardProps) {

  return (
    <>
    <Col xs={12} md={6} xxl={4} className={"py-1"} >
      <Card>
        <Stack direction="horizontal" gap={3} className="mx-2">
          <span className="fst-italic fw-lighter">
            {getFileReference()}
          </span>
          <div className="ms-auto">
            <SmallGoldiButton
              active={true}
              onClick={props.onRemove}
              icon={closeIcon}
              tooltipText={'Aus Liste entfernen'}
            />
          </div>
        </Stack>
        <Card.Body>
          {
            props.project.meta &&
            <>
              <Card.Title>{props.project.meta.title || "?"}</Card.Title>
              <GoldiColorBar color={props.project.meta.color} />
              <Card.Text>{props.project.meta.description}</Card.Text>
            </>
          }
          <Button
            onClick={props.onOpen}
            variant="outline-dark"
            className="my-3"
          >
            Open
          </Button>
        </Card.Body>
      </Card>
    </Col>
    </>
  )

  function getFileReference(): string {
    if (!props.project.fileHandle) {
      return "unsaved draft";
    }
    if (props.project.state === ProjectState.AheadOfFile) {
      return "*" + props.project.fileHandle.name;
    }
    return props.project.fileHandle.name;
  }
}