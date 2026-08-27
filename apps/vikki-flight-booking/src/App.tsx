import React, { useState, useEffect } from 'react';
import { Search } from './screens/Search';
import { Results } from './screens/Results';
import { ResultsReturn } from './screens/ResultsReturn';
import type { BookingState, Screen } from './types';
import './App.css';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('search');
  const [bookingState, setBookingState] = useState<BookingState>({
    tripType: 'oneway',
    origin: null,
    destination: null,
    departureDate: null,
    returnDate: null,
    passengerCount: { adults: 1, children: 0, infants: 0 },
    sessionId: null,
    returnSessionId: null,
    expiresAt: null,
    offers: [],
    returnOffers: [],
    selectedOutboundFlight: null,
    selectedReturnFlight: null,
  });

  const handleNavigate = (screen: Screen, newState?: Partial<BookingState>) => {
    if (newState) {
      setBookingState((prev) => ({ ...prev, ...newState }));
    }
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'search':
        return (
          <Search
            bookingState={bookingState}
            onNavigate={handleNavigate}
          />
        );
      case 'results':
        return (
          <Results
            bookingState={bookingState}
            onNavigate={handleNavigate}
          />
        );
      case 'results-return':
        return (
          <ResultsReturn
            bookingState={bookingState}
            onNavigate={handleNavigate}
          />
        );
      default:
        return <Search bookingState={bookingState} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app">
      {renderScreen()}
    </div>
  );
};

export default App;