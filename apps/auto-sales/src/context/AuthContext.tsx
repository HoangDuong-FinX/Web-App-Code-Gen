import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { AuthRole, UserProfile } from "../types";

interface AuthState {
  role: AuthRole;
  user: UserProfile | null;
  token: string | null;
}

interface AuthContextValue extends AuthState {
  login: (user: UserProfile, token: string) => void;
  loginAsAdmin: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    role: "guest",
    user: null,
    token: null,
  });

  const login = useCallback((user: UserProfile, token: string) => {
    setState({ role: "customer", user, token });
  }, []);

  const loginAsAdmin = useCallback(() => {
    setState({
      role: "admin",
      user: { id: "admin-001", name: "Admin", phone: "0900000000" },
      token: "admin-fixture-token",
    });
  }, []);

  const logout = useCallback(() => {
    setState({ role: "guest", user: null, token: null });
  }, []);

  const value: AuthContextValue = {
    ...state,
    login,
    loginAsAdmin,
    logout,
    isAuthenticated: state.role !== "guest",
    isAdmin: state.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
