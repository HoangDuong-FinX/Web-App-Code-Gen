import React, { useState, useCallback } from 'react';
import { useStore } from './store/useStore';
import { HomeSearch } from './screens/HomeSearch';
import { FlightResults } from './screens/FlightResults';
import { Passengers } from './screens/Passengers';
import { ServicesGrid } from './screens/ServicesGrid';
import { AncillaryDetail } from './screens/AncillaryDetail';
import { SeatMap } from './screens/SeatMap';
import { Review } from './screens/Review';
import { Checkout } from './screens/Checkout';
import { DoneSuccess } from './screens/DoneSuccess';
import { DoneFailure } from './screens/DoneFailure';
import { DonePartial } from './screens/DonePartial';

export type ScreenId =
  | 'home-search'
  | 'flight-results'
  | 'passengers'
  | 'services-grid'
  | 'ancillary-detail'
  | 'seat-map'
  | 'review'
  | 'checkout'
  | 'done-success'
  | 'done-failure'
  | 'done-partial';

export interface NavigationParams {
  category?: string;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home-search');
  const [navParams, setNavParams] = useState<NavigationParams>({});
  const store = useStore();

  const navigate = useCallback((screen: ScreenId, params?: NavigationParams) => {
    const guardedScreens: ScreenId[] = [
      'flight-results', 'passengers', 'services-grid',
      'ancillary-detail', 'seat-map', 'review', 'checkout',
      'done-success', 'done-failure', 'done-partial'
    ];
    if (guardedScreens.includes(screen) && !store.sessionId) {
      setCurrentScreen('home-search');
      setNavParams({});
      return;
    }
    setCurrentScreen(screen);
    setNavParams(params ?? {});
  }, [store.sessionId]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home-search':
        return <HomeSearch navigate={navigate} />;
      case 'flight-results':
        return <FlightResults navigate={navigate} />;
      case 'passengers':
        return <Passengers navigate={navigate} />;
      case 'services-grid':
        return <ServicesGrid navigate={navigate} />;
      case 'ancillary-detail':
        return <AncillaryDetail navigate={navigate} category={navParams.category ?? 'meals'} />;
      case 'seat-map':
        return <SeatMap navigate={navigate} />;
      case 'review':
        return <Review navigate={navigate} />;
      case 'checkout':
        return <Checkout navigate={navigate} />;
      case 'done-success':
        return <DoneSuccess navigate={navigate} />;
      case 'done-failure':
        return <DoneFailure navigate={navigate} />;
      case 'done-partial':
        return <DonePartial navigate={navigate} />;
      default:
        return <HomeSearch navigate={navigate} />;
    }
  };

  return (
    <div className="app-root" data-brand="vikki" data-theme="light">
      {renderScreen()}
    </div>
  );
}

export default App;
