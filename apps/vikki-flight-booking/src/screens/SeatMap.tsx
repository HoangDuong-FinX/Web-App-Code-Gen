import React, { useEffect, useState } from 'react';
import type { ScreenProps, SeatOption, SeatSelection } from '../types';
import { t } from '../i18n';
import { httpGet, httpPost, unwrap } from '../sdk/http';
import Text from '../components/Text';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import AlertNote from '../components/AlertNote';

export default function SeatMap(props: ScreenProps) {
  const { booking, setBooking, navigate } = props;
  const [seats, setSeats] = useState<SeatOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<SeatSelection[]>(booking.seatSelections);
  const [activeLeg, setActiveLeg] = useState<'outbound' | 'return'>('outbound');
  const [submitting, setSubmitting] = useState(false);

  const sessionId = activeLeg === 'outbound' ? booking.outboundSession?.sessionId : booking.returnSession?.sessionId;
  const offerId = activeLeg === 'outbound' ? booking.selectedOutboundOffer?.offerId : booking.selectedReturnOffer?.offerId;

  const loadSeats = async () => {
    if (!sessionId || !offerId) return;
    setLoading(true);
    setError(false);
    try {
      const res = await httpGet<SeatOption[]>(`/sessions/${sessionId}/seat-options?offer_id=${offerId}`, 'booking');
      setSeats(unwrap(res));
      setLoading(false);
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => { loadSeats(); }, [activeLeg]);

  const totalPassengers = (booking.searchParams?.passengers.adults ?? 1) + (booking.searchParams?.passengers.children ?? 0);

  const handleSeatClick = (seat: SeatOption) => {
    if (!seat.available || seat.priceAmount === null) return;
    setSelectedSeats(prev => {
      const existing = prev.find(s => s.seatCode === seat.seatCode);
      if (existing) return prev.filter(s => s.seatCode !== seat.seatCode);
      if (prev.length >= totalPassengers) return prev;
      return [...prev, { passengerIndex: prev.length + 1, seatCode: seat.seatCode }];
    });
  };

  const handleConfirm = async () => {
    if (!sessionId) return;
    setSubmitting(true);
    try {
      await httpPost(`/sessions/${sessionId}/seat-selections`, { selections: selectedSeats }, 'booking');
      setBooking(prev => activeLeg === 'outbound' ? { ...prev, seatSelections: selectedSeats } : { ...prev, returnSeatSelections: selectedSeats });
      navigate('services-hub');
    } catch {
      setError(true);
    }
    setSubmitting(false);
  };

  const maxRow = seats.length > 0 ? Math.max(...seats.map(s => s.row)) : 0;
  const maxCol = seats.length > 0 ? Math.max(...seats.map(s => s.col)) : 6;

  return (
    <div className="screen">
      <div className="header-row">
        <IconButton icon="back" onClick={() => navigate('services-hub')} ariaLabel={t('common.back.aria')} />
        <Text variant="title-2" as="h1">{t('seat.title')}</Text>
        <div style={{ width: 40 }} />
      </div>

      {booking.tripType === 'round' && (
        <div style={{ display: 'flex', gap: 'var(--gap-008)' }} aria-label={t('seat.tab.aria')}>
          <button type="button" onClick={() => setActiveLeg('outbound')} style={{ flex: 1, padding: '8px', borderRadius: 'var(--radius-008)', background: activeLeg === 'outbound' ? 'var(--main-primary)' : 'var(--fill-normal)', color: activeLeg === 'outbound' ? 'var(--common-100)' : 'var(--label-normal)', fontSize: 13, fontWeight: 600 }}>{t('bookingSummary.outbound')}</button>
          <button type="button" onClick={() => setActiveLeg('return')} style={{ flex: 1, padding: '8px', borderRadius: 'var(--radius-008)', background: activeLeg === 'return' ? 'var(--main-primary)' : 'var(--fill-normal)', color: activeLeg === 'return' ? 'var(--common-100)' : 'var(--label-normal)', fontSize: 13, fontWeight: 600 }}>{t('bookingSummary.return')}</button>
        </div>
      )}

      <div style={{ display: 'flex', gap: 'var(--gap-012)', fontSize: 11 }} aria-label={t('seat.legend.aria')}>
        <span>\u25A0 {t('seat.available')}</span>
        <span style={{ color: 'var(--main-primary)' }}>\u25A0 {t('seat.selected')}</span>
        <span style={{ color: 'var(--label-disable)' }}>\u25A0 {t('seat.occupied')}</span>
      </div>

      {loading && <Text>{t('common.loading')}</Text>}

      {!loading && seats.length === 0 && !error && (
        <Text ariaLabel={t('seat.empty')}>{t('seat.empty')}</Text>
      )}

      {!loading && seats.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${maxCol}, 1fr)`, gap: 4 }} aria-label={t('seat.map.aria')}>
          {Array.from({ length: maxRow }, (_, r) =>
            Array.from({ length: maxCol }, (_, c) => {
              const seat = seats.find(s => s.row === r + 1 && s.col === c + 1);
              if (!seat) return <div key={`${r}-${c}`} />;
              const isSelected = selectedSeats.some(s => s.seatCode === seat.seatCode);
              return (
                <button
                  key={seat.seatCode}
                  type="button"
                  disabled={!seat.available || seat.priceAmount === null}
                  onClick={() => handleSeatClick(seat)}
                  aria-label={`${seat.seatCode} ${seat.available ? (seat.priceAmount ? seat.priceAmount.toLocaleString('vi-VN') + ' VND' : '') : t('seat.unavailable')}`}
                  style={{
                    width: '100%', aspectRatio: '1', borderRadius: 'var(--radius-008)', fontSize: 10, fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isSelected ? 'var(--main-primary)' : !seat.available ? 'var(--interaction-disable)' : 'var(--fill-normal)',
                    color: isSelected ? 'var(--common-100)' : !seat.available ? 'var(--label-disable)' : 'var(--label-normal)',
                    cursor: seat.available && seat.priceAmount !== null ? 'pointer' : 'not-allowed',
                  }}
                >
                  {seat.seatCode}
                </button>
              );
            })
          )}
        </div>
      )}

      {selectedSeats.length > 0 && (
        <Text variant="body-semibold" ariaLabel={t('seat.selected.aria')}>
          {selectedSeats.map(s => s.seatCode).join(', ')}
        </Text>
      )}

      <AlertNote visible={error} variant="error" actionLabel={t('seat.error.retry')} onAction={loadSeats}>
        {t('common.error.generic')}
      </AlertNote>

      <Button variant="gradient" onClick={handleConfirm} disabled={submitting} ariaLabel={t('seat.confirm.aria')}>
        {submitting ? t('common.loading') : t('seat.confirm')}
      </Button>
    </div>
  );
}
