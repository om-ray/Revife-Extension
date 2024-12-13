'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { FirebaseProvider } from '@/contexts/FirebaseContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <FirebaseProvider>
        {children}
        <Toaster position="top-center" />
      </FirebaseProvider>
    </ClerkProvider>
  );
}
