import { useState, useEffect } from 'react';
import { appDataRepository, Project } from '../../db/appData';
import GoldiView from './view/GoldiView';
import { onBeforeUnload } from '../../window/onbeforeunload';
import GoldiEdit from './edit/GoldiEdit';
import NavBarForActiveGoldi from './NavBarForActiveGoldi';
import { Container } from 'react-bootstrap';
import { useLiveQuery } from 'dexie-react-hooks';

type ActiveGoldiProps = {
  projectId: string;
  onClose: () => void;
}

export enum GoldiMode {
  View,
  Edit
}

export default function ActiveGoldi(props: ActiveGoldiProps) {

  const project: undefined | Project = useLiveQuery(() => appDataRepository.projects.get(props.projectId));
  const [goldiMode, setGoldiMode] = useState<GoldiMode>(GoldiMode.View);

  useEffect(() => {
    // loadFile(props.projectId);
  }, [props.projectId]);

  useEffect(() => {
    if (project && project.meta) document.title = project.meta.title;
    window.removeEventListener('beforeunload', onBeforeUnload, true);
    // if (saveNeeded) {
    //   console.warn("Unsafed changes are  present.");
    //   window.addEventListener('beforeunload', onBeforeUnload, true);
    // }
  });

  return (
    <Container fluid>
      {project &&
        <>
          <NavBarForActiveGoldi
            project={project}
            setGoldiMode={setGoldiMode}
            onClose={props.onClose}
          />
          {(goldiMode === GoldiMode.View) &&
            <GoldiView projectId={props.projectId} goldiMeta={project.meta}></GoldiView>
          }
          {(goldiMode === GoldiMode.Edit) &&
            <GoldiEdit project={project} />
          }
        </>
      }
    </Container>
  );
}