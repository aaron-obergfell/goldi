import './App.css';
import React, { useState, useEffect } from 'react';

import { openFileOnLaunch } from './fs/open';
import ActiveGoldi from './components/ActiveGoldi';
import InactiveGoldi from './components/InactiveGoldi';

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

  if (projectId) {
    return (
      <ActiveGoldi
        projectId={projectId}
        onClose={() => setProjectId(undefined)}
      />
    );
  }
  return (
    <InactiveGoldi open={setProjectId} />
  );
}


export default App;