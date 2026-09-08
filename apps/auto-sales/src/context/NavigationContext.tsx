import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { ScreenId } from "../types";

interface NavState {
  currentScreen: ScreenId;
  params: Record<string, unknown>;
  history: { screen: ScreenId; params: Record<string, unknown> }[];
  returnTo: ScreenId | null;
}

interface NavigationContextValue {
  currentScreen: ScreenId;
  params: Record<string, unknown>;
  navigate: (screen: ScreenId, params?: Record<string, unknown>) => void;
  goBack: () => void;
  setReturnTo: (screen: ScreenId | null) => void;
  returnTo: ScreenId | null;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NavState>({
    currentScreen: "home",
    params: {},
    history: [],
    returnTo: null,
  });

  const navigate = useCallback((screen: ScreenId, params: Record<string, unknown> = {}) => {
    setState((prev) => ({
      currentScreen: screen,
      params,
      history: [...prev.history, { screen: prev.currentScreen, params: prev.params }],
      returnTo: prev.returnTo,
    }));
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => {
      if (prev.history.length === 0) return prev;
      const last = prev.history[prev.history.length - 1];
      return {
        currentScreen: last.screen,
        params: last.params,
        history: prev.history.slice(0, -1),
        returnTo: prev.returnTo,
      };
    });
  }, []);

  const setReturnTo = useCallback((screen: ScreenId | null) => {
    setState((prev) => ({ ...prev, returnTo: screen }));
  }, []);

  return (
    <NavigationContext.Provider value={{ currentScreen: state.currentScreen, params: state.params, navigate, goBack, setReturnTo, returnTo: state.returnTo }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation(): NavigationContextValue {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNavigation must be inside NavigationProvider");
  return ctx;
}
