import React, { useState, useEffect } from 'react';

import { openFileOnLaunch } from '../fs/open';
import ActiveGoldi from './active/ActiveGoldi';
import InactiveGoldi from './inactive/InactiveGoldi';
import { Container } from 'react-bootstrap';

declare global {
  interface Window { launchQueue: any; }
  interface LaunchParams {
    readonly files: FileSystemFileHandle[];
  }
}

function App() {

  const [projectId, setProjectId] = useState<string | null>(null);

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
      onClose={() => setProjectId(null)}
    />
  ) : (
    <InactiveGoldi open={setProjectId} />
  );
}


export default App;