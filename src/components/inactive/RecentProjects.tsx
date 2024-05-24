import { useLiveQuery } from 'dexie-react-hooks';
import { Row, Spinner } from 'react-bootstrap';

import { appDataRepository, Project } from '../../db/appData';
import GoldiProjectCard from './GoldiProjectCard';

type RecentProjectsProps = {
  open: (projectId: Project) => void;
}

export default function RecentProjects(props: RecentProjectsProps) {

  const projects: undefined | Project[] = useLiveQuery(() => appDataRepository.projects.toArray());

  return (
    <>
      <h3 className="text-center">Recent projects</h3>
      {
        projects ? (
          <Row>
            {projects.map((project) => (<GoldiProjectCard project={project} open={props.open} key={project.id}/>))}
          </Row>
        ) : (
          <Spinner animation="border" size="sm" />
        )
      }
    </>
  );
}