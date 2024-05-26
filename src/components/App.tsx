import { useState } from 'react';
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
    <ActiveGoldi
      projectId={projectId}
      onClose={() => setProjectId(undefined)}
    />
  ) : (
    <InactiveGoldi setProjectId={setProjectId} />
  );
}


export default App;