import React from 'react';
import { ScreenId } from '../App';
import { useStore } from '../store/useStore';
import { t } from '../i18n';
import { StatusIcon } from '../components/StatusIcon';
import { formatCurrency } from '../utils/format';

interface Props {
  navigate: (screen: ScreenId) => void;
}

export const DoneFailure: React.FC<Props> = ({ navigate }) => {
  const store = useStore();

  const outboundOffer = store.offers.find((o) => o.offerId === store.selectedOfferId);
  const returnOffer = store.tripType === 'round-trip'
    ? store.returnOffers.find((o) => o.offerId === store.selectedReturnOfferId)
    : null;

  const paxCount = store.adults + store.children;
  const fareSubtotal = ((outboundOffer?.farePrice ?? 0) + (returnOffer?.farePrice ?? 0)) * paxCount;
  const servicesTotal = store.ancillarySelections.reduce((sum, s) => sum + s.price * s.quantity, 0)
    + store.returnAncillarySelections.reduce((sum, s) => sum + s.price * s.quantity, 0)
    + store.seatSelections.reduce((sum, s) => sum + s.price, 0)
    + store.returnSeatSelections.reduce((sum, s) => sum + s.price, 0);
  const totalAmount = fareSubtotal + servicesTotal;

  const handleRetry = () => {
    store.update({ paymentError: null });
    navigate('checkout');
  };

  const handleHome = () => {
    store.reset();
    navigate('home-search');
  };

  return (
    <div style={{ padding: 16, maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <StatusIcon variant="error" ariaLabel={t('done.failure.title')} />
        <h1 style={{ fontSize: 22, fontWeight: 'bold', margin: 0 }}>{t('done.failure.title')}</h1>
        <span style={{ fontSize: 20, fontWeight: 'bold' }} aria-label={t('done.failure.amount.ariaLabel')}>
          {formatCurrency(totalAmount)}
        </span>
      </div>

      {/* Details card */}
      <div style={{ border: '1px solid #e0e0e0', borderRadius: 12, padding: 16, marginBottom: 24, textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13 }}>{t('done.failure.bookingCode')}</span>
          <span style={{ fontSize: 13, fontWeight: 'bold' }}>{store.outboundBookingCode ?? '-'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13 }}>{t('done.failure.reason')}</span>
          <span style={{ fontSize: 13, color: '#c62828' }}>{store.paymentError ?? '-'}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          type="button"
          onClick={handleRetry}
          aria-label={t('done.failure.retry.ariaLabel')}
          style={{
            width: '100%', padding: 14, borderRadius: 8, border: 'none',
            backgroundColor: '#E31837', color: '#fff', fontWeight: 'bold', fontSize: 16, cursor: 'pointer',
          }}
        >
          {t('done.failure.retry')}
        </button>
        <button
          type="button"
          onClick={handleHome}
          aria-label={t('done.failure.home.ariaLabel')}
          style={{
            width: '100%', padding: 12, borderRadius: 8, border: 'none',
            backgroundColor: 'transparent', color: '#666', fontSize: 14, cursor: 'pointer',
          }}
        >
          {t('done.failure.home')}
        </button>
      </div>
    </div>
  );
};
