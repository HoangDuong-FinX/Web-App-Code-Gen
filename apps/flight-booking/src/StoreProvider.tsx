import { useReducer, type ReactNode } from 'react';
import { AppStateContext, AppDispatchContext, appReducer, initialState } from './store';

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (<AppStateContext.Provider value={state}><AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider></AppStateContext.Provider>);
}
