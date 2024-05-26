import { useLiveQuery } from 'dexie-react-hooks';
import { Row, Spinner } from 'react-bootstrap';

import { appDataRepository, Project } from '../../db/appData';
import { checkRecentBeforeRemove } from '../../logic/projectService';
import GoldiProjectCard from './GoldiProjectCard';

type RecentProjectsProps = {
  onOpen: (project: Project) => void;
  onRemove: (project: Project) => void;
}

export default function RecentProjects(props: RecentProjectsProps) {

  const projects: undefined | Project[] = useLiveQuery(() => appDataRepository.projects.toArray());

  return (
    <>
      <h3 className="text-center">Recent projects</h3>
      {
        projects ? (
          <Row>
            {projects.map((project) => {

              return (
                <GoldiProjectCard
                  project={project}
                  onOpen={() => props.onOpen(project)}
                  onRemove={() => props.onRemove(project)}
                  key={project.id}
                  />
              )
            })}
          </Row>
        ) : (
          <Spinner animation="border" size="sm" />
        )
      }
    </>
  );
}