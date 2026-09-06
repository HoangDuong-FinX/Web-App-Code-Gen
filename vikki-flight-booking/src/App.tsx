import React, { useState, useEffect } from 'react';
import { useStore } from './store';
import { t } from './i18n';
import { fixtureAirports, fixtureCityPairs } from './fixtures';
import { Airport, CityPair } from './types';
import Search from './screens/Search';
import Results from './screens/Results';
import Passengers from './screens/Passengers';
import Services from './screens/Services';
import Payment from './screens/Payment';
import Checkout from './screens/Checkout';
import Done from './screens/Done';

const App: React.FC = () => {
  const { currentScreen, booking, navigateTo, updateBooking, resetBooking } = useStore();
  const [airports, setAirports] = useState<Airport[]>([]);
  const [cityPairs, setCityPairs] = useState<CityPair[]>([]);
  const [masterDataError, setMasterDataError] = useState<string | null>(null);
  const [masterDataLoading, setMasterDataLoading] = useState(true);

  useEffect(() => {
    const loadMasterData = async () => {
      try {
        const [airportsData, cityPairsData] = await Promise.all([
          fixtureAirports(),
          fixtureCityPairs(),
        ]);
        setAirports(airportsData);
        setCityPairs(cityPairsData);
        setMasterDataError(null);
      } catch (error) {
        setMasterDataError(t('search.masterDataError'));
      } finally {
        setMasterDataLoading(false);
      }
    };
    loadMasterData();
  }, []);

  const commonProps = {
    airports,
    cityPairs,
    masterDataError,
    masterDataLoading,
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'search':
        return <Search {...commonProps} />;
      case 'results':
        return <Results {...commonProps} />;
      case 'results-return':
        return <Results {...commonProps} isReturn />;
      case 'passengers':
        return <Passengers {...commonProps} />;
      case 'services':
        return <Services {...commonProps} />;
      case 'payment':
        return <Payment {...commonProps} />;
      case 'checkout':
        return <Checkout {...commonProps} />;
      case 'done':
        return <Done {...commonProps} />;
      default:
        return <Search {...commonProps} />;
    }
  };

  return (
    <div className="gg-brand-vikki min-h-screen bg-white">
      <main className="flex flex-col">{renderScreen()}</main>
    </div>
  );
};

export default App;
