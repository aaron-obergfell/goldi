import { useState, useEffect } from 'react';

import { openFileOnLaunch } from '../fs/open';
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

  useEffect(() => {
    if ('launchQueue' in window) {
      window.launchQueue.setConsumer((launchParams: LaunchParams) => {
        openFileOnLaunch(launchParams, setProjectId);
      });
    }
  }, []);

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