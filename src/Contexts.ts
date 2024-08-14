import { createContext, useContext } from 'react';
import { ProjectDataRepository } from './db/projectData';

export const DBContext = createContext<ProjectDataRepository | null>(null);

export const useCurrentProjectDB = () => {
    const useCurrentProjectDB = useContext(DBContext);
  
    if (!useCurrentProjectDB) {
      throw new Error(
        "useCurrentProjectDB has to be used within <DBContext.Provider>"
      );
    }
  
    return useCurrentProjectDB;
  };