import React, { useState } from 'react';
import { ScreenId } from '../App';
import { useStore } from '../store/useStore';
import { t } from '../i18n';
import { useTimer } from '../hooks/useTimer';
import { formatCurrency } from '../utils/format';
import { FlightOffer } from '../store/useStore';

interface Props {
  navigate: (screen: ScreenId) => void;
}

export const FlightResults: React.FC<Props> = ({ navigate }) => {
  const store = useStore();
  const { isExpired, formattedTime } = useTimer(store.expiresAt);
  const [selectingReturn, setSelectingReturn] = useState(false);

  const offers = selectingReturn ? store.returnOffers : store.offers;
  const title = selectingReturn ? t('results.returnLeg.title') : t('results.title');

  const handleSelectOffer = (offer: FlightOffer) => {
    if (isExpired) return;
    if (!selectingReturn) {
      store.update({
        selectedOfferId: offer.offerId,
        ancillarySelections: [],
        seatSelections: [],
      });
      if (store.tripType === 'round-trip') {
        setSelectingReturn(true);
      } else {
        navigate('passengers');
      }
    } else {
      store.update({
        selectedReturnOfferId: offer.offerId,
        returnAncillarySelections: [],
        returnSeatSelections: [],
      });
      navigate('passengers');
    }
  };

  const handleBack = () => {
    store.update({
      sessionId: null,
      returnSessionId: null,
      expiresAt: null,
      offers: [],
      returnOffers: [],
      selectedOfferId: null,
      selectedReturnOfferId: null,
    });
    navigate('home-search');
  };

  const handleExpiredRestart = () => {
    store.reset();
    navigate('home-search');
  };

  return (
    <div style={{ padding: 16, maxWidth: 480, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button type="button" onClick={handleBack} aria-label={t('results.back.ariaLabel')} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: 20 }}>
          ←
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 'bold', margin: 0 }}>{title}</h1>
        <span aria-label={t('results.timer.ariaLabel')} style={{ color: isExpired ? '#c62828' : '#e65100', fontSize: 14, fontWeight: 'bold' }}>
          {formattedTime}
        </span>
      </div>

      {/* Expired overlay */}
      {isExpired && (
        <div style={{ textAlign: 'center', padding: 32 }}>
          <p style={{ fontSize: 16, marginBottom: 16 }}>{t('results.expired.message')}</p>
          <button
            type="button"
            onClick={handleExpiredRestart}
            aria-label={t('results.expired.ariaLabel')}
            style={{ padding: '12px 24px', borderRadius: 8, border: 'none', backgroundColor: '#E31837', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: 14 }}
          >
            {t('results.expired.button')}
          </button>
        </div>
      )}

      {/* Flight cards */}
      {!isExpired && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {offers.map((offer) => (
            <div key={offer.offerId} style={{ border: '1px solid #e0e0e0', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <img src={offer.airlineLogo} alt="Airline logo" width={24} height={24} style={{ borderRadius: 4 }} />
                <span style={{ fontSize: 13 }}>{offer.flightNumber}</span>
                <span style={{ fontSize: 12, color: '#666', marginLeft: 'auto' }}>{offer.duration}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 'bold' }}>{offer.departureTime}</span>
                <span style={{ color: '#999' }}>✈</span>
                <span style={{ fontSize: 16, fontWeight: 'bold' }}>{offer.arrivalTime}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 11, color: '#666' }}>{offer.departureAirportName}</span>
                <span style={{ fontSize: 11, color: '#666' }}>{offer.arrivalAirportName}</span>
              </div>
              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: 11, color: '#666', display: 'block' }}>{offer.fareClassName}</span>
                  <span style={{ fontSize: 16, fontWeight: 'bold', color: '#E31837' }}>{formatCurrency(offer.farePrice)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectOffer(offer)}
                  aria-label={t('results.select.ariaLabel')}
                  style={{ padding: '8px 20px', borderRadius: 6, border: 'none', backgroundColor: '#E31837', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: 13 }}
                >
                  {t('results.select')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
