import { t } from '../i18n';
import type { ScreenId } from '../types';

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  isAuthenticated: boolean;
}

const tabs: { screen: ScreenId; labelKey: string; icon: string }[] = [
  { screen: 'home', labelKey: 'nav.home', icon: '\u2302' },
  { screen: 'search-results', labelKey: 'nav.search', icon: '\u2315' },
  { screen: 'wishlist', labelKey: 'nav.wishlist', icon: '\u2661' },
  { screen: 'my-orders', labelKey: 'nav.orders', icon: '\u2637' },
  { screen: 'profile', labelKey: 'nav.profile', icon: '\u263A' },
];

export default function BottomNav({ currentScreen, onNavigate, isAuthenticated }: BottomNavProps) {
  const handleTap = (screen: ScreenId) => {
    if ((screen === 'wishlist' || screen === 'my-orders' || screen === 'profile') && !isAuthenticated) {
      onNavigate('login');
      return;
    }
    onNavigate(screen);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-40"
      aria-label={t('nav.home')}
    >
      {tabs.map((tab) => {
        const isActive = currentScreen === tab.screen;
        return (
          <button
            key={tab.screen}
            onClick={() => handleTap(tab.screen)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
            aria-label={t(tab.labelKey)}
            data-testid={`nav-${tab.screen}`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs mt-0.5">{t(tab.labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
}
