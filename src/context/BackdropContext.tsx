import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface BackdropContextType {
  backdropOpen: boolean;
  showBackdrop: () => void;
  hideBackdrop: () => void;
}

const BackdropContext = createContext<BackdropContextType | undefined>(undefined);

//export function BackdropProvider(children: ReactNode) {
export const BackdropProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [backdropOpen, setBackdropOpen] = useState(false);

  const showBackdrop = () => setBackdropOpen(true);
  const hideBackdrop = () => setBackdropOpen(false);

  return (
    <BackdropContext.Provider value={{ backdropOpen, showBackdrop, hideBackdrop }}>
      {children}
    </BackdropContext.Provider>
  );
};

export const useBackdrop = () => {
  const context = useContext(BackdropContext);
  if (context === undefined) {
    throw new Error('useBackdrop must be used within a BackdropProvider');
  }
  return context;
};