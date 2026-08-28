import React from 'react';
import { ScreenId } from '../App';
import { useStore } from '../store/useStore';
import { t } from '../i18n';
import { StatusIcon } from '../components/StatusIcon';

interface Props {
  navigate: (screen: ScreenId) => void;
}

export const DonePartial: React.FC<Props> = ({ navigate }) => {
  const store = useStore();

  const handleHome = () => {
    store.reset();
    navigate('home-search');
  };

  return (
    <div style={{ padding: 16, maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <StatusIcon variant="warning" ariaLabel={t('done.partial.title')} />
        <h1 style={{ fontSize: 22, fontWeight: 'bold', margin: 0 }}>{t('done.partial.title')}</h1>
      </div>

      {/* Details card */}
      <div style={{ border: '1px solid #e0e0e0', borderRadius: 12, padding: 16, marginBottom: 16, textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13 }}>{t('done.partial.outboundCode')}</span>
          <span style={{ fontSize: 13, fontWeight: 'bold' }}>{store.outboundBookingCode ?? '-'}</span>
        </div>
      </div>

      <p style={{ fontSize: 14, color: '#666', marginBottom: 24, lineHeight: 1.5 }}>
        {t('done.partial.explanation')}
      </p>

      {/* Action */}
      <button
        type="button"
        onClick={handleHome}
        aria-label={t('done.partial.home.ariaLabel')}
        style={{
          width: '100%', padding: 14, borderRadius: 8, border: 'none',
          backgroundColor: '#E31837', color: '#fff', fontWeight: 'bold', fontSize: 16, cursor: 'pointer',
        }}
      >
        {t('done.partial.home')}
      </button>
    </div>
  );
};
