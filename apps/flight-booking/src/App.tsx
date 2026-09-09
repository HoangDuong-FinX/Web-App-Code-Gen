import { useState, useCallback } from 'react';
import { I18nProvider } from './i18n/index';
import { AppStateProvider } from './store';
import type { ScreenId } from './types';
import { SearchScreen } from './screens/SearchScreen';
import { AirportPickerScreen } from './screens/AirportPickerScreen';
import { DatePickerScreen } from './screens/DatePickerScreen';
import { PassengerCountScreen } from './screens/PassengerCountScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { ResultsReturnScreen } from './screens/ResultsReturnScreen';
import { PassengersScreen } from './screens/PassengersScreen';
import { ServicesScreen } from './screens/ServicesScreen';
import { MealsBaggageScreen } from './screens/MealsBaggageScreen';
import { SeatsScreen } from './screens/SeatsScreen';
import { ReviewScreen } from './screens/ReviewScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { DoneSuccessScreen } from './screens/DoneSuccessScreen';
import { DoneFailureScreen } from './screens/DoneFailureScreen';
import { DonePartialScreen } from './screens/DonePartialScreen';

export type AirportPickerMode = 'departure' | 'arrival';
export type MealsBaggageMode = 'meals' | 'baggage';

export interface NavigationState {
  screen: ScreenId;
  airportPickerMode?: AirportPickerMode;
  mealsBaggageMode?: MealsBaggageMode;
}

function App() {
  const [nav, setNav] = useState<NavigationState>({ screen: 'search' });

  const navigate = useCallback((screen: ScreenId, extra?: Partial<NavigationState>) => {
    setNav({ screen, ...extra });
  }, []);

  const renderScreen = () => {
    switch (nav.screen) {
      case 'search':
        return <SearchScreen navigate={navigate} />;
      case 'airport-picker':
        return <AirportPickerScreen navigate={navigate} mode={nav.airportPickerMode ?? 'departure'} />;
      case 'date-picker':
        return <DatePickerScreen navigate={navigate} />;
      case 'passenger-count':
        return <PassengerCountScreen navigate={navigate} />;
      case 'results':
        return <ResultsScreen navigate={navigate} />;
      case 'results-return':
        return <ResultsReturnScreen navigate={navigate} />;
      case 'passengers':
        return <PassengersScreen navigate={navigate} />;
      case 'services':
        return <ServicesScreen navigate={navigate} />;
      case 'meals-baggage':
        return <MealsBaggageScreen navigate={navigate} mode={nav.mealsBaggageMode ?? 'meals'} />;
      case 'seats':
        return <SeatsScreen navigate={navigate} />;
      case 'review':
        return <ReviewScreen navigate={navigate} />;
      case 'checkout':
        return <CheckoutScreen navigate={navigate} />;
      case 'done-success':
        return <DoneSuccessScreen navigate={navigate} />;
      case 'done-failure':
        return <DoneFailureScreen navigate={navigate} />;
      case 'done-partial':
        return <DonePartialScreen navigate={navigate} />;
      default:
        return <SearchScreen navigate={navigate} />;
    }
  };

  return (
    <I18nProvider initialLocale="vi">
      <AppStateProvider>
        <div className="min-h-screen bg-gray-50" data-testid="app-root">
          <div className="mx-auto max-w-md min-h-screen bg-white shadow-sm">
            {renderScreen()}
          </div>
        </div>
      </AppStateProvider>
    </I18nProvider>
  );
}

export default App;
