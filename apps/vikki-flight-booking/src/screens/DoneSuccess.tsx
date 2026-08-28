import React, { useState, useEffect } from 'react';
import { ScreenId } from '../App';
import { useStore } from '../store/useStore';
import { t } from '../i18n';
import { pollTransaction } from '../sdk/payment';
import { StatusIcon } from '../components/StatusIcon';
import { formatCurrency } from '../utils/format';

interface Props {
  navigate: (screen: ScreenId) => void;
}

export const DoneSuccess: React.FC<Props> = ({ navigate }) => {
  const store = useStore();
  const [shareSupported] = useState(() => typeof navigator !== 'undefined' && typeof navigator.share === 'function');

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

  useEffect(() => {
    if (store.transactionId === null && store.viaHost) {
      pollTransaction('sim_ps_001').then((result) => {
        if (result) {
          store.update({ transactionId: result.transactionId });
        }
      }).catch(() => { /* swallow per BR-13 */ });
    }
  }, []);

  const handleShare = async () => {
    if (!shareSupported) return;
    try {
      await navigator.share({
        title: t('done.success.title'),
        text: `${store.originName} → ${store.destinationName} - ${formatCurrency(totalAmount)}`,
      });
    } catch { /* user cancelled share */ }
  };

  const handleNewBooking = () => {
    store.reset();
    navigate('home-search');
  };

  const handleHome = () => {
    store.reset();
    navigate('home-search');
  };

  return (
    <div style={{ padding: 16, maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <StatusIcon variant="success" ariaLabel={t('done.success.title')} />
        <h1 style={{ fontSize: 22, fontWeight: 'bold', margin: 0 }}>{t('done.success.title')}</h1>
        <span style={{ fontSize: 20, fontWeight: 'bold', color: '#2e7d32' }} aria-label={t('done.success.amount.ariaLabel')}>
          -{formatCurrency(totalAmount)}
        </span>
      </div>

      {/* Details card */}
      <div style={{ border: '1px solid #e0e0e0', borderRadius: 12, padding: 16, marginBottom: 16, textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13 }}>{t('done.success.outboundCode')}</span>
          <span style={{ fontSize: 13, fontWeight: 'bold' }}>{store.outboundBookingCode ?? '-'}</span>
        </div>
        {store.tripType === 'round-trip' && store.returnBookingCode && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13 }}>{t('done.success.returnCode')}</span>
            <span style={{ fontSize: 13, fontWeight: 'bold' }}>{store.returnBookingCode}</span>
          </div>
        )}
        {store.transactionId && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13 }}>{t('done.success.transactionId')}</span>
            <span style={{ fontSize: 13 }}>{store.transactionId}</span>
          </div>
        )}
      </div>

      <p style={{ fontSize: 11, color: '#666', marginBottom: 16 }}>{t('done.success.vatNotice')}</p>

      {/* Simulated warning */}
      {!store.viaHost && (
        <div role="alert" aria-label={t('done.success.simulated.ariaLabel')} style={{ padding: 12, backgroundColor: '#fff3e0', borderRadius: 8, color: '#e65100', fontSize: 13, marginBottom: 16 }}>
          {t('done.success.simulated')}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          type="button"
          onClick={handleShare}
          disabled={!shareSupported}
          aria-label={t('done.success.share.ariaLabel')}
          style={{
            width: '100%', padding: 12, borderRadius: 8, border: '1px solid #e0e0e0',
            backgroundColor: '#fff', color: '#333', fontWeight: 'bold', fontSize: 14,
            cursor: shareSupported ? 'pointer' : 'not-allowed', opacity: shareSupported ? 1 : 0.5,
          }}
        >
          {t('done.success.share')}
        </button>
        <button
          type="button"
          onClick={handleNewBooking}
          aria-label={t('done.success.newBooking.ariaLabel')}
          style={{
            width: '100%', padding: 14, borderRadius: 8, border: 'none',
            backgroundColor: '#E31837', color: '#fff', fontWeight: 'bold', fontSize: 16, cursor: 'pointer',
          }}
        >
          {t('done.success.newBooking')}
        </button>
        <button
          type="button"
          onClick={handleHome}
          aria-label={t('done.success.home.ariaLabel')}
          style={{
            width: '100%', padding: 12, borderRadius: 8, border: 'none',
            backgroundColor: 'transparent', color: '#666', fontSize: 14, cursor: 'pointer',
          }}
        >
          {t('done.success.home')}
        </button>
      </div>
    </div>
  );
};
