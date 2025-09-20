
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserMode } from '@/hooks/use-user-mode';

type UserModeContextType = {
  userMode: 'Buyer' | 'Seller';
  setUserMode: (mode: 'Buyer' | 'Seller') => void;
};

const UserModeContext = createContext<UserModeContextType>({
  userMode: 'Buyer',
  setUserMode: () => {},
});

export const useUserModeContext = () => useContext(UserModeContext);

interface UserModeProviderProps {
  children: React.ReactNode;
}

export const UserModeProvider: React.FC<UserModeProviderProps> = ({ children }) => {
  // Use our Zustand store for persistent state
  const { mode, setMode } = useUserMode();
  const [userMode, setUserMode] = useState<'Buyer' | 'Seller'>(mode);
  
  // Update local state when store changes
  useEffect(() => {
    setUserMode(mode);
  }, [mode]);
  
  // Update store when local state changes
  const handleModeChange = (newMode: 'Buyer' | 'Seller') => {
    setMode(newMode);
    setUserMode(newMode);
  };
  
  return (
    <UserModeContext.Provider value={{ userMode, setUserMode: handleModeChange }}>
      {children}
    </UserModeContext.Provider>
  );
};
