import React, { useState, useCallback, useMemo } from 'react';
import { BookingProvider, useBooking } from './context/BookingContext';
import { I18nContext, createI18n, type Locale } from './i18n';
import { SearchScreen } from './screens/SearchScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { ResultsReturnScreen } from './screens/ResultsReturnScreen';
import { PassengersScreen } from './screens/PassengersScreen';
import { HoldExpiredScreen } from './screens/HoldExpiredScreen';
import type { ScreenId, MiniAppProps } from './types';

// Placeholder screens for batches 2 & 3 — will be replaced
function PlaceholderScreen({ id, onNavigate }: { id: ScreenId; onNavigate: (s: ScreenId) => void }) {
  return (
    <div className="screen screen--placeholder">
      <p>Screen "{id}" — implementation pending (batch 2/3)</p>
      <button onClick={() => onNavigate('search')} type="button">Back to Search</button>
    </div>
  );
}

function AppShell() {
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
      return <SearchScreen onNavigate={(s) => navigate(s)} />;
    case 'results':
      return <ResultsScreen onNavigate={(s) => navigate(s)} />;
    case 'results-return':
      return <ResultsReturnScreen onNavigate={(s) => navigate(s)} />;
    case 'passengers':
      return <PassengersScreen onNavigate={(s) => navigate(s)} />;
    case 'hold-expired':
      return <HoldExpiredScreen onNavigate={(s) => navigate(s)} />;
    // Batch 2 screens
    case 'services':
    case 'review':
    case 'checkout':
    case 'payment-pending':
    // Batch 3 screens
    case 'payment-success':
    case 'payment-failed':
    case 'payment-partial':
      return <PlaceholderScreen id={effectiveScreen} onNavigate={navigate} />;
    default:
      return <SearchScreen onNavigate={(s) => navigate(s)} />;
  }
}

export default function App({ hostRuntime }: MiniAppProps) {
  const locale: Locale = (hostRuntime?.locale as Locale) ?? 'vi';
  const i18n = useMemo(() => createI18n(locale), [locale]);

  return (
    <div className="gg-brand-vikki app-root" data-theme="light">
      <I18nContext.Provider value={i18n}>
        <BookingProvider>
          <AppShell />
        </BookingProvider>
      </I18nContext.Provider>
    </div>
  );
}
