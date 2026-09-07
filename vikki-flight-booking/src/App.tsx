import React, { useEffect, useState } from 'react';
import { useStore } from './store';
import Search from './screens/Search';
import Results from './screens/Results';
import ResultsReturn from './screens/ResultsReturn';
import Passengers from './screens/Passengers';
import Services from './screens/Services';
import Payment from './screens/Payment';
import Checkout from './screens/Checkout';
import Done from './screens/Done';

interface AppProps {
  hostRuntime?: { id?: string; name?: string; theme?: string; locale?: string };
  basename?: string;
}

function App({ hostRuntime, basename }: AppProps) {
  const currentScreen = useStore((s) => s.currentScreen);
  const setHostIdentity = useStore((s) => s.setHostIdentity);

  useEffect(() => {
    if (hostRuntime?.name) {
      setHostIdentity(hostRuntime.name);
    }
  }, [hostRuntime?.name, setHostIdentity]);

  const screenMap: Record<string, React.ReactNode> = {
    search: <Search />,
    results: <Results />,
    'results-return': <ResultsReturn />,
    passengers: <Passengers />,
    services: <Services />,
    payment: <Payment />,
    checkout: <Checkout />,
    done: <Done />,
  };

  const theme = hostRuntime?.theme || 'light';
  const locale = hostRuntime?.locale || 'vi';

  return (
    <div className={`gg-brand-vikki gg-theme-${theme} min-h-screen bg-white`}>
      <style>{`
        :root {
          --vikki-vkblue-700: rgb(0, 0, 255);
          --vikki-vkblue-500: rgb(47, 69, 255);
          --vikki-vkblue-50: rgb(232, 241, 255);
          --gray-50: rgb(247, 247, 248);
          --gray-200: rgb(218, 218, 221);
          --font-display: 'Roboto', sans-serif;
          --font-body: 'Inter', sans-serif;
          --font-mono: 'Menlo', monospace;
        }
      `}</style>
      {screenMap[currentScreen] || <Search />}
    </div>
  );
}

export default App;
