import React, { useState, useEffect } from 'react';
import {
  AppContext,
  BookingState,
  DEFAULT_SEARCH_CRITERIA,
  buildInitialPassengers,
} from './store';
import type { ScreenId } from './types';
import { SearchScreen } from './screens/SearchScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { PassengersScreen } from './screens/PassengersScreen';
import { ServicesScreen } from './screens/ServicesScreen';
import { PaymentScreen } from './screens/PaymentScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { DoneScreen } from './screens/DoneScreen';

const RECENT_SEARCHES_KEY = 'vikki-flight-recent-searches';

function loadRecentSearches() {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as BookingState['recentSearches'];
  } catch {
    return [];
  }
}

const INITIAL_STATE: BookingState = {
  currentScreen: 'search',
  airports: [],
  cityPairs: [],
  masterDataLoaded: false,
  masterDataError: null,
  searchCriteria: DEFAULT_SEARCH_CRITERIA,
  outboundSessionId: null,
  returnSessionId: null,
  expiresAt: null,
  outboundOffers: [],
  returnOffers: [],
  dailyPrices: {},
  selectedOutboundOffer: null,
  selectedOutboundFare: null,
  selectedReturnOffer: null,
  selectedReturnFare: null,
  passengers: buildInitialPassengers(DEFAULT_SEARCH_CRITERIA),
  outboundAncillaryCatalog: null,
  returnAncillaryCatalog: null,
  seatMap: [],
  outboundMeals: [],
  outboundBaggage: null,
  outboundSeats: [],
  returnMeals: [],
  returnBaggage: null,
  returnSeats: [],
  outboundBookingKey: null,
  returnBookingKey: null,
  bookingResult: null,
  recentSearches: loadRecentSearches(),
  hostName: null,
  hostTheme: 'light',
};

export default function App() {
  const [state, setState] = useState<BookingState>(INITIAL_STATE);

  // Guard: screens after search need a session; redirect to search if missing
  useEffect(() => {
    const guarded: ScreenId[] = ['passengers', 'services', 'payment', 'checkout', 'done'];
    if (guarded.includes(state.currentScreen) && !state.outboundSessionId) {
      setState(s => ({ ...s, currentScreen: 'search' }));
    }
  }, [state.currentScreen, state.outboundSessionId]);

  const navigate = (screen: ScreenId) => {
    setState(s => ({ ...s, currentScreen: screen }));
  };

  const screenMap: Record<ScreenId, React.ReactElement> = {
    search: <SearchScreen />,
    results: <ResultsScreen leg="outbound" />,
    'results-return': <ResultsScreen leg="return" />,
    passengers: <PassengersScreen />,
    services: <ServicesScreen />,
    payment: <PaymentScreen />,
    checkout: <CheckoutScreen />,
    done: <DoneScreen />,
  };

  return (
    <AppContext.Provider value={{ state, navigate, setState }}>
      <div
        className="gg-brand-vikki app-root"
        data-theme={state.hostTheme}
      >
        {screenMap[state.currentScreen]}
      </div>
    </AppContext.Provider>
  );
}
