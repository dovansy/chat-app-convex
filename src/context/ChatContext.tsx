import React, { createContext, useContext, useState } from 'react';
import type { Id } from '../../convex/_generated/dataModel';

interface GroupContextType {
  currentGroupSelect: Id<'groups'> | null;
  setCurrentGroupSelect: (id: Id<'groups'> | null) => void;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const GroupProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentGroupSelect, setCurrentGroupSelect] =
    useState<Id<'groups'> | null>(null);

  return (
    <GroupContext.Provider
      value={{ currentGroupSelect, setCurrentGroupSelect }}
    >
      {children}
    </GroupContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error('useGroup must be used within a GroupProvider');
  }
  return context;
};
