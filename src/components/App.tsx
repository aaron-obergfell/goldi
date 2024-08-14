import { useState } from 'react';
import { DBContext } from '../Contexts';
import { ProjectDataRepository } from '../db/projectData';
import ActiveGoldi from './active/ActiveGoldi';
import InactiveGoldi from './inactive/InactiveGoldi';

declare global {
  interface Window { launchQueue: any; }
  interface LaunchParams {
    readonly files: FileSystemFileHandle[];
  }
}

function App() {

  const [projectId, setProjectId] = useState<string | undefined>(undefined);


  return projectId ? (
    <DBContext.Provider value={new ProjectDataRepository(projectId)}>
      <ActiveGoldi
        projectId={projectId}
        onClose={() => setProjectId(undefined)}
      />
    </DBContext.Provider>
  ) : (
    <InactiveGoldi setProjectId={setProjectId} />
  );
}


export default App;