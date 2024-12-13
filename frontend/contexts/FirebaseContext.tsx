'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { app, db } from '../firebase/config';

const FirebaseContext = createContext<{
  app: any;
  db: any;
  initialized: boolean;
}>({
  app,
  db,
  initialized: false,
});

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Any additional Firebase setup can go here
    setInitialized(true);
  }, []);

  return (
    <FirebaseContext.Provider value={{ app, db, initialized }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}
