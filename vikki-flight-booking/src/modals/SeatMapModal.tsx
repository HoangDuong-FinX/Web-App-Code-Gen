import React, { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Text } from '../components/Text';
import { AlertNote } from '../components/AlertNote';
import { t, formatVnd } from '../i18n';
import { fixtureLoadSeatMap, type SeatOption } from '../fixtures/seatMap';
import type { SeatSelection, PassengerInfo } from '../types/state';

interface SeatMapModalProps {
  sessionId: string;
  passengers: PassengerInfo[];
  tripType: string;
  origin: string;
  destination: string;
  existingSeats: SeatSelection[];
  onConfirm: (seats: SeatSelection[]) => void;
  onClose: () => void;
}

const ZONE_COLORS: Record<string, string> = {
  Front: 'var(--vikki-vkblue-500)',
  Premium: 'var(--vikki-vkblue-300)',
  Standard: 'var(--color-success)',
  Relax: 'var(--gray-400)',
};

export function SeatMapModal({
  sessionId,
  passengers,
  origin,
  destination,
  existingSeats,
  onConfirm,
  onClose,
}: SeatMapModalProps): React.ReactElement {
  const [seatMap, setSeatMap] = useState<SeatOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPaxIndex, setSelectedPaxIndex] = useState(0);
  const [selections, setSelections] = useState<SeatSelection[]>(existingSeats);

  useEffect(() => {
    fixtureLoadSeatMap(sessionId)
      .then(seats => { setSeatMap(seats); setLoading(false); })
      .catch(() => { setError(t('services.seatMapError')); setLoading(false); });
  }, [sessionId]);

  const zones: SeatOption['zone'][] = ['Front', 'Premium', 'Standard', 'Relax'];

  function handleSeatClick(seat: SeatOption) {
    if (!seat.available || seat.priceAmount === null || seat.priceAmount <= 0) return;
    const paxIndex = selectedPaxIndex + 1;
    setSelections(prev => {
      const filtered = prev.filter(s => s.passengerIndex !== paxIndex);
      const alreadySelected = prev.find(s => s.passengerIndex === paxIndex && s.seatNumber === seat.seatNumber);
      if (alreadySelected) return filtered;
      return [...filtered, { passengerIndex: paxIndex, seatNumber: seat.seatNumber, priceAmount: seat.priceAmount! }];
    });
  }

  const totalSeatCost = selections.reduce((sum, s) => sum + s.priceAmount, 0);

  const rowMap: Record<number, SeatOption[]> = {};
  seatMap.forEach(seat => {
    const row = parseInt(seat.seatNumber.replace(/[A-Z]/g, ''), 10);
    if (!rowMap[row]) rowMap[row] = [];
    rowMap[row].push(seat);
  });

  const paxOptions = passengers.map((_p, i) => ({
    label: `Kh\u00e1ch ${i + 1}`,
    value: String(i),
  }));

  return (
    <Modal
      title={t('seatMap.title')}
      dismissible
      onClose={onClose}
      data-testid="seat-map-modal"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
        <div style={{ font: 'var(--text-body-semibold)', color: 'var(--color-text-secondary)' }}>
          {origin} → {destination}
        </div>

        {passengers.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {paxOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedPaxIndex(parseInt(opt.value, 10))}
                aria-pressed={selectedPaxIndex === parseInt(opt.value, 10)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: `1.5px solid ${selectedPaxIndex === parseInt(opt.value, 10) ? 'var(--color-primary)' : 'var(--gray-200)'}`,
                  background: selectedPaxIndex === parseInt(opt.value, 10) ? 'var(--color-primary-light)' : '#fff',
                  cursor: 'pointer',
                  font: 'var(--text-body-semibold)',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        <Text variant="body-semibold">{t('seatMap.seatTypes')}</Text>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {zones.map(zone => (
            <div key={zone} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: ZONE_COLORS[zone] }} />
              <Text variant="body">{t(`seatMap.zone.${zone}` as Parameters<typeof t>[0])}</Text>
            </div>
          ))}
        </div>

        {loading && <AlertNote tone="neutral" visible>{t('common.loading')}</AlertNote>}
        {error && <AlertNote tone="critical" visible role="alert">{error}</AlertNote>}

        {!loading && !error && (
          <div
            data-testid="seat-map-grid"
            style={{ overflowY: 'auto', maxHeight: '320px' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '32px repeat(3, 1fr) 8px repeat(3, 1fr)', gap: '3px', marginBottom: '4px' }}>
              <div />
              {['A', 'B', 'C'].map(c => (
                <div key={c} style={{ textAlign: 'center', font: 'var(--text-caption-2)', color: 'var(--color-text-secondary)' }}>{c}</div>
              ))}
              <div />
              {['D', 'E', 'F'].map(c => (
                <div key={c} style={{ textAlign: 'center', font: 'var(--text-caption-2)', color: 'var(--color-text-secondary)' }}>{c}</div>
              ))}
            </div>
            {Object.entries(rowMap).sort(([a], [b]) => parseInt(a) - parseInt(b)).map(([row, seats]) => {
              const sortedSeats = seats.sort((a, b) => a.seatNumber.localeCompare(b.seatNumber));
              const leftSeats = sortedSeats.filter(s => ['A', 'B', 'C'].includes(s.seatNumber.replace(/\d/g, '')));
              const rightSeats = sortedSeats.filter(s => ['D', 'E', 'F'].includes(s.seatNumber.replace(/\d/g, '')));
              return (
                <div key={row} style={{ display: 'grid', gridTemplateColumns: '32px repeat(3, 1fr) 8px repeat(3, 1fr)', gap: '3px', marginBottom: '3px' }}>
                  <div style={{ textAlign: 'center', font: 'var(--text-caption-2)', color: 'var(--color-text-secondary)', paddingTop: '6px' }}>{row}</div>
                  {leftSeats.map(seat => <SeatButton key={seat.seatNumber} seat={seat} selections={selections} selectedPaxIndex={selectedPaxIndex} onClick={handleSeatClick} />)}
                  <div />
                  {rightSeats.map(seat => <SeatButton key={seat.seatNumber} seat={seat} selections={selections} selectedPaxIndex={selectedPaxIndex} onClick={handleSeatClick} />)}
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--text-body)' }}>
          <span>{t('seatMap.total')}</span>
          <Text variant="body-semibold">{formatVnd(totalSeatCost)}</Text>
        </div>

        <Button
          variant="primary"
          onClick={() => onConfirm(selections)}
          ariaLabel={t('seatMap.confirm.ariaLabel')}
          data-testid="confirm-button"
          fullWidth
        >
          {t('seatMap.confirm')}
        </Button>
      </div>
    </Modal>
  );
}

interface SeatButtonProps {
  seat: SeatOption;
  selections: SeatSelection[];
  selectedPaxIndex: number;
  onClick: (seat: SeatOption) => void;
}

function SeatButton({ seat, selections, selectedPaxIndex, onClick }: SeatButtonProps): React.ReactElement {
  const paxIndex = selectedPaxIndex + 1;
  const isSelectedByMe = selections.some(s => s.passengerIndex === paxIndex && s.seatNumber === seat.seatNumber);
  const isSelectedByOther = selections.some(s => s.passengerIndex !== paxIndex && s.seatNumber === seat.seatNumber);
  const isSelectable = seat.available && seat.priceAmount !== null && seat.priceAmount > 0;

  return (
    <button
      type="button"
      onClick={() => onClick(seat)}
      disabled={!isSelectable || isSelectedByOther}
      aria-label={`${seat.seatNumber} ${seat.available ? '' : t('seatMap.unavailable')}`}
      aria-pressed={isSelectedByMe}
      style={{
        width: '100%',
        aspectRatio: '1',
        borderRadius: '4px',
        border: 'none',
        background: isSelectedByMe
          ? 'var(--color-primary)'
          : isSelectedByOther
          ? 'var(--gray-300)'
          : !seat.available
          ? 'var(--gray-200)'
          : seat.priceAmount === null
          ? 'var(--gray-100)'
          : ZONE_COLORS[seat.zone],
        color: isSelectedByMe ? '#fff' : 'var(--color-text-primary)',
        cursor: isSelectable && !isSelectedByOther ? 'pointer' : 'not-allowed',
        font: 'var(--text-caption-2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: (!seat.available || seat.priceAmount === null) ? 0.4 : 1,
      }}
    >
      {!seat.available ? '\u00d7' : seat.seatNumber.replace(/\d/g, '')}
    </button>
  );
}
