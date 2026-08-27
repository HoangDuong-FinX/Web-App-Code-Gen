interface BottomNavBarProps {
  activeTab?: string;
  ariaLabel?: string;
}

export function BottomNavBar({ activeTab = 'Home', ariaLabel }: BottomNavBarProps) {
  const { t } = useI18n();
  const tabs = [
    { id: 'Home', label: t('nav.home'), icon: 'home' },
    { id: 'Bookings', label: t('nav.bookings'), icon: 'bookings' },
    { id: 'Account', label: t('nav.account'), icon: 'account' },
  ];
  return (
    <nav className="bottom-nav" aria-label={ariaLabel ?? t('nav.ariaLabel')}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`bottom-nav__tab ${activeTab === tab.id ? 'bottom-nav__tab--active' : ''}`}
          aria-current={activeTab === tab.id ? 'page' : undefined}
          type="button"
        >
          <span className="bottom-nav__icon" aria-hidden="true">{tab.icon === 'home' ? '⌂' : tab.icon === 'bookings' ? '✈' : '☺'}</span>
          <span className="bottom-nav__label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

import { useI18n } from '../i18n';
