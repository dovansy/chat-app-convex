/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useCallback, useContext, useState } from 'react';

interface AuthContextType {
  currentUser: any | null;
  currentUserId: string | null;
  loginUser: (userData: any) => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  currentUserId: null,
  loginUser: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  const loginUser = useCallback((userData: any) => {
    setCurrentUser(userData);
  }, []);
  
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentUserId: currentUser?._id ?? null,
        loginUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
