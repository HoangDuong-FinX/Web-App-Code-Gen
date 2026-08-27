import React, { useState, useCallback, useMemo } from 'react';
import { BookingProvider, useBooking } from './context/BookingContext';
import { I18nContext, createI18n, type Locale } from './i18n';
import { SearchScreen } from './screens/SearchScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { ResultsReturnScreen } from './screens/ResultsReturnScreen';
import { PassengersScreen } from './screens/PassengersScreen';
import { ServicesScreen } from './screens/ServicesScreen';
import { ReviewScreen } from './screens/ReviewScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { PaymentPendingScreen } from './screens/PaymentPendingScreen';
import { HoldExpiredScreen } from './screens/HoldExpiredScreen';
import type { ScreenId, MiniAppProps } from './types';

// Placeholder screens for batch 3 — will be replaced
function PlaceholderScreen({ id, onNavigate }: { id: ScreenId; onNavigate: (s: ScreenId) => void }) {
  return (
    <div className="screen screen--placeholder">
      <p>Screen &quot;{id}&quot; — implementation pending (batch 3)</p>
      <button onClick={() => onNavigate('search')} type="button">Back to Search</button>
    </div>
  );
}

function AppShell({ hostRuntime }: { hostRuntime?: MiniAppProps['hostRuntime'] }) {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('search');
  const { state } = useBooking();

  // Deep-link guard: if no session and not on search, redirect
  const effectiveScreen = useMemo(() => {
    if (currentScreen !== 'search' && !state.outboundSession) {
      return 'search';
    }
    return currentScreen;
  }, [currentScreen, state.outboundSession]);

  const navigate = useCallback((screen: ScreenId) => {
    setCurrentScreen(screen);
  }, []);

  switch (effectiveScreen) {
    case 'search':
      return <SearchScreen onNavigate={navigate} />;
    case 'results':
      return <ResultsScreen onNavigate={navigate} />;
    case 'results-return':
      return <ResultsReturnScreen onNavigate={navigate} />;
    case 'passengers':
      return <PassengersScreen onNavigate={navigate} />;
    case 'services':
      return <ServicesScreen onNavigate={navigate} />;
    case 'review':
      return <ReviewScreen onNavigate={navigate} />;
    case 'checkout':
      return <CheckoutScreen onNavigate={navigate} hostRuntime={hostRuntime} />;
    case 'payment-pending':
      return <PaymentPendingScreen onNavigate={navigate} hostRuntime={hostRuntime} />;
    case 'hold-expired':
      return <HoldExpiredScreen onNavigate={navigate} />;
    // Batch 3 screens
    case 'payment-success':
    case 'payment-failed':
    case 'payment-partial':
      return <PlaceholderScreen id={effectiveScreen} onNavigate={navigate} />;
    default:
      return <SearchScreen onNavigate={navigate} />;
  }
}

export default function App({ hostRuntime }: MiniAppProps) {
  const locale: Locale = (hostRuntime?.locale as Locale) ?? 'vi';
  const i18n = useMemo(() => createI18n(locale), [locale]);

  return (
    <div className="gg-brand-vikki app-root" data-theme="light">
      <I18nContext.Provider value={i18n}>
        <BookingProvider>
          <AppShell hostRuntime={hostRuntime} />
        </BookingProvider>
      </I18nContext.Provider>
    </div>
  );
}
