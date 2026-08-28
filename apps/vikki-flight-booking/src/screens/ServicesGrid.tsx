import React, { useState } from 'react';
import { ScreenId, NavigationParams } from '../App';
import { useStore } from '../store/useStore';
import { t } from '../i18n';
import { useTimer } from '../hooks/useTimer';
import { submitAncillarySelections, submitSeatSelections } from '../sdk/http';
import { ServiceTile } from '../components/ServiceTile';

interface Props {
  navigate: (screen: ScreenId, params?: NavigationParams) => void;
}

export const ServicesGrid: React.FC<Props> = ({ navigate }) => {
  const store = useStore();
  const { isExpired, formattedTime } = useTimer(store.expiresAt);
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (isExpired || loading) return;
    setLoading(true);
    setSaveError(null);
    try {
      const ancillaryPayload = store.ancillarySelections.flatMap((sel) => {
        const entries: Array<{ passenger_id: string; option_id: string }> = [];
        for (let i = 0; i < sel.quantity; i++) {
          entries.push({ passenger_id: sel.passengerId, option_id: sel.optionId });
        }
        return entries;
      });

      const seatPayload = store.seatSelections.map((sel) => ({
        passenger_index: sel.passengerIndex,
        seat_id: sel.seatId,
      }));

      const promises: Promise<unknown>[] = [];

      if (ancillaryPayload.length > 0) {
        promises.push(submitAncillarySelections(store.sessionId!, ancillaryPayload));
      }
      if (seatPayload.length > 0) {
        promises.push(submitSeatSelections(store.sessionId!, seatPayload));
      }

      if (store.tripType === 'round-trip' && store.returnSessionId) {
        const returnAncillaryPayload = store.returnAncillarySelections.flatMap((sel) => {
          const entries: Array<{ passenger_id: string; option_id: string }> = [];
          for (let i = 0; i < sel.quantity; i++) {
            entries.push({ passenger_id: sel.passengerId, option_id: sel.optionId });
          }
          return entries;
        });
        const returnSeatPayload = store.returnSeatSelections.map((sel) => ({
          passenger_index: sel.passengerIndex,
          seat_id: sel.seatId,
        }));
        if (returnAncillaryPayload.length > 0) {
          promises.push(submitAncillarySelections(store.returnSessionId, returnAncillaryPayload));
        }
        if (returnSeatPayload.length > 0) {
          promises.push(submitSeatSelections(store.returnSessionId, returnSeatPayload));
        }
      }

      await Promise.all(promises);
      navigate('review');
    } catch {
      setSaveError(t('services.error.save'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 480, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button type="button" onClick={() => navigate('passengers')} aria-label={t('common.back.ariaLabel')} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: 20 }}>
          ←
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 'bold', margin: 0 }}>{t('services.title')}</h1>
        <span aria-label={t('common.timer.ariaLabel')} style={{ color: isExpired ? '#c62828' : '#e65100', fontSize: 14, fontWeight: 'bold' }}>
          {formattedTime}
        </span>
      </div>

      {/* Services grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        <ServiceTile icon="seat" label={t('services.seats')} ariaLabel={t('services.seats')} onClick={() => navigate('seat-map')} />
        <ServiceTile icon="meal" label={t('services.meals')} ariaLabel={t('services.meals')} onClick={() => navigate('ancillary-detail', { category: 'meals' })} />
        <ServiceTile icon="baggage" label={t('services.baggage')} ariaLabel={t('services.baggage')} onClick={() => navigate('ancillary-detail', { category: 'baggage' })} />
        <ServiceTile icon="placeholder" label={t('services.comingSoon')} ariaLabel="Coming soon service 1" disabled badge={t('services.comingSoon')} />
        <ServiceTile icon="placeholder" label={t('services.comingSoon')} ariaLabel="Coming soon service 2" disabled badge={t('services.comingSoon')} />
        <ServiceTile icon="placeholder" label={t('services.comingSoon')} ariaLabel="Coming soon service 3" disabled badge={t('services.comingSoon')} />
        <ServiceTile icon="placeholder" label={t('services.comingSoon')} ariaLabel="Coming soon service 4" disabled badge={t('services.comingSoon')} />
        <ServiceTile icon="placeholder" label={t('services.comingSoon')} ariaLabel="Coming soon service 5" disabled badge={t('services.comingSoon')} />
        <ServiceTile icon="placeholder" label={t('services.comingSoon')} ariaLabel="Coming soon service 6" disabled badge={t('services.comingSoon')} />
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {saveError && (
          <div role="alert" style={{ padding: 12, backgroundColor: '#ffebee', borderRadius: 8, color: '#c62828', fontSize: 13 }}>
            {saveError}
          </div>
        )}
        {isExpired && (
          <div role="alert" style={{ padding: 12, backgroundColor: '#fff3e0', borderRadius: 8, color: '#e65100', fontSize: 13 }}>
            {t('services.holdExpired')}
            <button type="button" onClick={() => { store.reset(); navigate('home-search'); }} style={{ marginLeft: 8, color: '#e65100', textDecoration: 'underline', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: 13 }}>
              {t('services.holdExpired.action')}
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isExpired || loading}
          aria-label={t('services.submit.ariaLabel')}
          style={{
            width: '100%', padding: 14, borderRadius: 8, border: 'none',
            backgroundColor: (isExpired || loading) ? '#e0e0e0' : '#E31837',
            color: '#fff', fontWeight: 'bold', fontSize: 16, cursor: (isExpired || loading) ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '...' : t('services.submit')}
        </button>
      </div>
    </div>
  );
};
