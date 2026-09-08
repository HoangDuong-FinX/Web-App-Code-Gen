import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Buyer } from '../types';

interface AuthContextValue {
  buyer: Buyer | null;
  isLoggedIn: boolean;
  login: (buyer: Buyer) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  buyer: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [buyer, setBuyer] = useState<Buyer | null>(null);

  const login = useCallback((b: Buyer) => {
    setBuyer(b);
  }, []);

  const logout = useCallback(() => {
    setBuyer(null);
  }, []);

  return (
    <AuthContext.Provider value={{ buyer, isLoggedIn: buyer !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
