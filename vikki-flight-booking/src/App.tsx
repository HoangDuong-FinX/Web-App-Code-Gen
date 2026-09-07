import React, { useReducer } from 'react';
import { appReducer, INITIAL_STATE } from './state';
import { SearchScreen } from './screens/SearchScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { PassengersScreen } from './screens/PassengersScreen';
import { ServicesScreen } from './screens/ServicesScreen';
import { PaymentScreen } from './screens/PaymentScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { DoneScreen } from './screens/DoneScreen';
import type { ScreenId } from './types';

// Navigation state machine: one root component, one screen ID in state,
// one named transition per edge. No router library (C-14).

export default function App() {
  const [state, dispatch] = useReducer(appReducer, INITIAL_STATE);

  // Deep-link / direct-navigation guard: if session is missing on a protected
  // screen, redirect to search (binding: deep-link-redirect).
  const protectedScreens: ScreenId[] = [
    'results', 'results-return', 'passengers', 'services', 'payment', 'checkout', 'done',
  ];
  const needsSession = protectedScreens.includes(state.screen);
  const hasSession = state.outboundSession !== null;
  if (needsSession && !hasSession && state.screen !== 'done') {
    // Redirect to search without rendering the protected screen
    dispatch({ type: 'NAVIGATE', screen: 'search' });
    return null;
  }

  const renderScreen = () => {
    switch (state.screen) {
      case 'search':
        return <SearchScreen state={state} dispatch={dispatch} />;
      case 'results':
      case 'results-return':
        return <ResultsScreen state={state} dispatch={dispatch} />;
      case 'passengers':
        return <PassengersScreen state={state} dispatch={dispatch} />;
      case 'services':
        return <ServicesScreen state={state} dispatch={dispatch} />;
      case 'payment':
        return <PaymentScreen state={state} dispatch={dispatch} />;
      case 'checkout':
        return <CheckoutScreen state={state} dispatch={dispatch} />;
      case 'done':
        return <DoneScreen state={state} dispatch={dispatch} />;
      default: {
        // Exhaustive check: TypeScript will catch unhandled cases
        const _exhaustive: never = state.screen;
        return <SearchScreen state={state} dispatch={dispatch} />;
      }
    }
  };

  return (
    <div
      className="gg-brand-vikki min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-primary)]"
      data-testid="app-root"
    >
      {/* Demo mode banner */}
      <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 text-xs text-amber-800 text-center">
        ⚠️ Chế độ demo — Mọi dịch vụ đều là giả lập. Không có tiền thật nào được xử lý.
      </div>
      <main className="pb-8">
        {renderScreen()}
      </main>
    </div>
  );
}
