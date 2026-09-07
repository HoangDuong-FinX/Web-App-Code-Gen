import React, { useCallback, useReducer } from 'react';
import './styles/tokens.css';
import type { AppState, ScreenId } from './types/state';
import { initialAppState } from './types/state';
import { SearchScreen } from './screens/Search';
import { ResultsScreen } from './screens/Results';
import { PassengersScreen } from './screens/Passengers';
import { ServicesScreen } from './screens/Services';
import { PaymentScreen } from './screens/Payment';
import { CheckoutScreen } from './screens/Checkout';
import { DoneScreen } from './screens/Done';

type Action =
  | { type: 'NAVIGATE'; screen: ScreenId }
  | { type: 'UPDATE'; updates: Partial<AppState> }
  | { type: 'RESET' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, screen: action.screen };
    case 'UPDATE':
      return { ...state, ...action.updates };
    case 'RESET':
      return initialAppState();
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, initialAppState);

  const navigate = useCallback((screen: ScreenId) => {
    dispatch({ type: 'NAVIGATE', screen });
  }, []);

  const updateState = useCallback((updates: Partial<AppState>) => {
    dispatch({ type: 'UPDATE', updates });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const commonProps = { state, onNavigate: navigate, onUpdateState: updateState };

  return (
    <div
      className="gg-brand-vikki min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-primary)]"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* Navigation state machine — one screen per state */}
      {state.screen === 'search' && <SearchScreen {...commonProps} />}
      {state.screen === 'results' && <ResultsScreen {...commonProps} />}
      {state.screen === 'results-return' && <ResultsScreen {...commonProps} isReturn />}
      {state.screen === 'passengers' && <PassengersScreen {...commonProps} />}
      {state.screen === 'services' && <ServicesScreen {...commonProps} />}
      {state.screen === 'payment' && <PaymentScreen {...commonProps} />}
      {state.screen === 'checkout' && <CheckoutScreen {...commonProps} />}
      {state.screen === 'done' && <DoneScreen {...commonProps} onReset={reset} />}
    </div>
  );
}
