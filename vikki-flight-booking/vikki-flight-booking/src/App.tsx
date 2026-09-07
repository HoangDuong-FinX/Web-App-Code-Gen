import React, { useState, useEffect } from 'react';
import { Search } from './screens/Search';
import { Results } from './screens/Results';
import { Passengers } from './screens/Passengers';
import { Services } from './screens/Services';
import { Payment } from './screens/Payment';
import { Checkout } from './screens/Checkout';
import { Done } from './screens/Done';
import { useStore } from './store/store';
import { vi } from './i18n/vi';
import './App.css';

type ScreenId = 'search' | 'results' | 'passengers' | 'services' | 'payment' | 'checkout' | 'done';

interface AppProps {
  hostRuntime?: {
    identity?: { getUser?: () => Promise<{ id: string; name: string }> };
    theme?: { subscribe?: (callback: (theme: { theme: 'light' | 'dark'; brand: string }) => void) => () => void };
  };
}

export const App: React.FC<AppProps> = ({ hostRuntime }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('search');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { resetStore } = useStore();

  // Subscribe to host theme changes
  useEffect(() => {
    if (!hostRuntime?.theme?.subscribe) return;
    const unsubscribe = hostRuntime.theme.subscribe((themeData) => {
      setTheme(themeData.theme);
      document.documentElement.setAttribute('data-theme', themeData.theme);
    });
    return unsubscribe;
  }, [hostRuntime?.theme]);

  // Set brand class on app root
  useEffect(() => {
    const root = document.getElementById('app');
    if (root) {
      root.className = 'gg-brand-vikki';
    }
  }, []);

  const navigate = (screen: ScreenId) => {
    setCurrentScreen(screen);
  };

  const handleResetAndNavigate = (screen: ScreenId) => {
    resetStore();
    setCurrentScreen(screen);
  };

  // Session loss protection: if deep-linked to a screen without session, go back to search
  useEffect(() => {
    if (['passengers', 'services', 'payment', 'checkout'].includes(currentScreen)) {
      const { outboundSessionId } = useStore.getState();
      if (!outboundSessionId) {
        setCurrentScreen('search');
      }
    }
  }, [currentScreen]);

  const screenProps = {
    navigate,
    handleResetAndNavigate,
    hostRuntime,
    t: vi,
  };

  return (
    <div className={`app-container theme-${theme}`}>
      {currentScreen === 'search' && <Search {...screenProps} navigate={navigate} />}
      {currentScreen === 'results' && <Results {...screenProps} navigate={navigate} />}
      {currentScreen === 'passengers' && <Passengers {...screenProps} navigate={navigate} />}
      {currentScreen === 'services' && <Services {...screenProps} navigate={navigate} />}
      {currentScreen === 'payment' && <Payment {...screenProps} navigate={navigate} />}
      {currentScreen === 'checkout' && <Checkout {...screenProps} navigate={navigate} />}
      {currentScreen === 'done' && <Done {...screenProps} navigate={navigate} />}
    </div>
  );
};

export default App;