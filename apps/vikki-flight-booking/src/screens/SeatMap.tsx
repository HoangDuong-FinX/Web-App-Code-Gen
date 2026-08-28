import React, { useState, useEffect } from 'react';
import { ScreenId } from '../App';
import { useStore } from '../store/useStore';
import { t } from '../i18n';
import { loadSeatOptions } from '../sdk/http';
import { SeatOption } from '../types';
import { SeatCell } from '../components/SeatCell';
import { LegendItem } from '../components/LegendItem';
import { formatCurrency } from '../utils/format';

interface Props {
  navigate: (screen: ScreenId) => void;
}

export const SeatMap: React.FC<Props> = ({ navigate }) => {
  const store = useStore();
  const [seatRows, setSeatRows] = useState<SeatOption[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(
    store.seatSelections.length > 0 ? store.seatSelections[0].seatId : null
  );

  const fetchSeats = async () => {
    setLoading(true);
    setError(null);
    setIsEmpty(false);
    try {
      const data = await loadSeatOptions(store.sessionId!, store.selectedOfferId!);
      if (data.rows.length === 0) {
        setIsEmpty(true);
      } else {
        setSeatRows(data.rows);
      }
    } catch (e: unknown) {
      const err = e as { status?: number };
      if (err.status === 404) {
        setIsEmpty(true);
      } else {
        setError(t('seatMap.error.load'));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeats();
  }, []);

  const handleSeatClick = (seat: SeatOption) => {
    if (seat.state === 'unavailable' || seat.priceAmount === null) return;
    setSelectedSeatId(seat.seatId === selectedSeatId ? null : seat.seatId);
  };

  const handleConfirm = () => {
    if (!selectedSeatId) return;
    const selectedSeat = seatRows.flat().find((s) => s.seatId === selectedSeatId);
    if (selectedSeat) {
      store.update({
        seatSelections: [{
          passengerIndex: 1,
          seatId: selectedSeat.seatId,
          seatLabel: selectedSeat.seatId,
          price: selectedSeat.priceAmount ?? 0,
        }],
      });
    }
    navigate('services-grid');
  };

  return (
    <div style={{ padding: 16, maxWidth: 480, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <button type="button" onClick={() => navigate('services-grid')} aria-label={t('common.back.ariaLabel')} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: 20 }}>
          ←
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 'bold', margin: 0 }}>{t('seatMap.title')}</h1>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
        <LegendItem color="selected" label={t('seatMap.legend.selected')} ariaLabel={t('seatMap.legend.selected')} />
        <LegendItem color="emergency" label={t('seatMap.legend.emergency')} ariaLabel={t('seatMap.legend.emergency')} />
        <LegendItem color="reserved" label={t('seatMap.legend.reserved')} ariaLabel={t('seatMap.legend.reserved')} />
      </div>

      {/* Content */}
      {loading && <div style={{ textAlign: 'center', padding: 32, color: '#666' }}>...</div>}

      {isEmpty && !loading && (
        <div style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💺</div>
          <h2 style={{ fontSize: 16, marginBottom: 8 }}>{t('seatMap.empty.title')}</h2>
          <p style={{ fontSize: 14, color: '#666' }}>{t('seatMap.empty.description')}</p>
        </div>
      )}

      {error && !loading && (
        <div style={{ textAlign: 'center', padding: 32 }}>
          <div role="alert" style={{ padding: 12, backgroundColor: '#ffebee', borderRadius: 8, color: '#c62828', fontSize: 13, marginBottom: 12 }}>
            {error}
          </div>
          <button
            type="button"
            onClick={fetchSeats}
            aria-label={t('seatMap.error.retry.ariaLabel')}
            style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #e0e0e0', backgroundColor: '#fff', cursor: 'pointer', fontSize: 14 }}
          >
            {t('seatMap.error.retry')}
          </button>
        </div>
      )}

      {!loading && !isEmpty && !error && (
        <div style={{ overflowY: 'auto', maxHeight: 400 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            {seatRows.map((row, rowIdx) => (
              <div key={rowIdx} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {row.slice(0, 2).map((seat) => (
                  <SeatCell
                    key={seat.seatId}
                    seatId={seat.seatId}
                    state={seat.seatId === selectedSeatId ? 'selected' : seat.state}
                    price={seat.priceAmount}
                    isEmergency={seat.isEmergency}
                    ariaLabel={`Seat ${seat.seatId} - ${seat.state === 'unavailable' ? 'unavailable' : seat.priceAmount ? formatCurrency(seat.priceAmount) : 'not selectable'}`}
                    onClick={() => handleSeatClick(seat)}
                  />
                ))}
                <div style={{ width: 20 }} aria-hidden="true" />
                {row.slice(2, 4).map((seat) => (
                  <SeatCell
                    key={seat.seatId}
                    seatId={seat.seatId}
                    state={seat.seatId === selectedSeatId ? 'selected' : seat.state}
                    price={seat.priceAmount}
                    isEmergency={seat.isEmergency}
                    ariaLabel={`Seat ${seat.seatId} - ${seat.state === 'unavailable' ? 'unavailable' : seat.priceAmount ? formatCurrency(seat.priceAmount) : 'not selectable'}`}
                    onClick={() => handleSeatClick(seat)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      {!isEmpty && !error && (
        <div style={{ marginTop: 16 }}>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedSeatId}
            aria-label={t('seatMap.confirm.ariaLabel')}
            style={{
              width: '100%', padding: 14, borderRadius: 8, border: 'none',
              backgroundColor: selectedSeatId ? '#E31837' : '#e0e0e0',
              color: '#fff', fontWeight: 'bold', fontSize: 16, cursor: selectedSeatId ? 'pointer' : 'not-allowed',
            }}
          >
            {t('seatMap.confirm')}
          </button>
        </div>
      )}
    </div>
  );
};
