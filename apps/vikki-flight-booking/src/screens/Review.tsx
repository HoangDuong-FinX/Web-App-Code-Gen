import React from 'react';
import { ScreenId } from '../App';
import { useStore } from '../store/useStore';
import { t } from '../i18n';
import { formatCurrency, formatDate } from '../utils/format';

interface Props {
  navigate: (screen: ScreenId) => void;
}

export const Review: React.FC<Props> = ({ navigate }) => {
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

  return (
    <div style={{ padding: 16, maxWidth: 480, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button type="button" onClick={() => navigate('services-grid')} aria-label={t('common.back.ariaLabel')} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: 20 }}>
          ←
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 'bold', margin: 0 }}>{t('review.title')}</h1>
      </div>

      {/* Route summary */}
      <div style={{ border: '1px solid #e0e0e0', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 'bold' }}>{store.originName} → {store.destinationName}</span>
          <span style={{ fontSize: 11, backgroundColor: '#e3f2fd', borderRadius: 4, padding: '2px 6px', color: '#1565c0' }}>
            {store.tripType === 'round-trip' ? t('home.tripType.roundTrip') : t('home.tripType.oneWay')}
          </span>
        </div>
        <span style={{ fontSize: 13, color: '#666' }}>{store.departureDate ? formatDate(store.departureDate) : ''}</span>
        {store.tripType === 'round-trip' && store.returnDate && (
          <span style={{ fontSize: 13, color: '#666', display: 'block' }}>{formatDate(store.returnDate)}</span>
        )}
      </div>

      {/* Outbound */}
      {outboundOffer && (
        <div style={{ border: '1px solid #e0e0e0', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>{t('review.outbound')}</h3>
          <span style={{ fontSize: 13, display: 'block' }}>{outboundOffer.departureTime} - {outboundOffer.arrivalTime} ({outboundOffer.departureAirportName} → {outboundOffer.arrivalAirportName})</span>
          <span style={{ fontSize: 12, color: '#666', display: 'block' }}>{outboundOffer.duration}</span>
          <span style={{ fontSize: 13, display: 'block', marginTop: 4 }}>{outboundOffer.fareClassName}: {formatCurrency(outboundOffer.farePrice)} x {paxCount}</span>
          {store.ancillarySelections.length > 0 && (
            <span style={{ fontSize: 12, color: '#666', display: 'block' }}>
              {t('review.total.services')}: {formatCurrency(store.ancillarySelections.reduce((s, a) => s + a.price * a.quantity, 0) + store.seatSelections.reduce((s, a) => s + a.price, 0))}
            </span>
          )}
        </div>
      )}

      {/* Return */}
      {returnOffer && (
        <div style={{ border: '1px solid #e0e0e0', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>{t('review.return')}</h3>
          <span style={{ fontSize: 13, display: 'block' }}>{returnOffer.departureTime} - {returnOffer.arrivalTime} ({returnOffer.departureAirportName} → {returnOffer.arrivalAirportName})</span>
          <span style={{ fontSize: 12, color: '#666', display: 'block' }}>{returnOffer.duration}</span>
          <span style={{ fontSize: 13, display: 'block', marginTop: 4 }}>{returnOffer.fareClassName}: {formatCurrency(returnOffer.farePrice)} x {paxCount}</span>
          {store.returnAncillarySelections.length > 0 && (
            <span style={{ fontSize: 12, color: '#666', display: 'block' }}>
              {t('review.total.services')}: {formatCurrency(store.returnAncillarySelections.reduce((s, a) => s + a.price * a.quantity, 0) + store.returnSeatSelections.reduce((s, a) => s + a.price, 0))}
            </span>
          )}
        </div>
      )}

      {/* Totals */}
      <div style={{ backgroundColor: '#f5f5f5', borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>{t('review.total.heading')}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 13 }}>{t('review.total.fare')}</span>
          <span style={{ fontSize: 13 }}>{formatCurrency(fareSubtotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13 }}>{t('review.total.services')}</span>
          <span style={{ fontSize: 13 }}>{formatCurrency(servicesTotal)}</span>
        </div>
        <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 15, fontWeight: 'bold' }}>{t('review.total.amount')}</span>
          <span style={{ fontSize: 15, fontWeight: 'bold', color: '#E31837' }}>{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      {/* Continue */}
      <button
        type="button"
        onClick={() => navigate('checkout')}
        aria-label={t('review.continue.ariaLabel')}
        style={{
          width: '100%', padding: 14, borderRadius: 8, border: 'none',
          backgroundColor: '#E31837', color: '#fff', fontWeight: 'bold', fontSize: 16, cursor: 'pointer',
        }}
      >
        {t('review.continue')}
      </button>
    </div>
  );
};
