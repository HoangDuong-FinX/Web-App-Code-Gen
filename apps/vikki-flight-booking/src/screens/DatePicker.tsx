import React, { useState, useMemo } from 'react';
import type { ScreenProps } from '../types';
import { t } from '../i18n';
import Text from '../components/Text';
import Button from '../components/Button';
import IconButton from '../components/IconButton';

export default function DatePicker(props: ScreenProps) {
  const { navigate, booking, setBooking } = props;
  const tripType = booking.tripType;
  const [selectedDate, setSelectedDate] = useState(booking.searchParams?.departureDate ?? '');
  const [selectedReturnDate, setSelectedReturnDate] = useState(booking.searchParams?.returnDate ?? '');

  const months = useMemo(() => {
    const result: { year: number; month: number; label: string }[] = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      result.push({ year: d.getFullYear(), month: d.getMonth(), label: `${d.toLocaleString('vi', { month: 'long' })} ${d.getFullYear()}` });
    }
    return result;
  }, []);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getStartDay = (year: number, month: number) => new Date(year, month, 1).getDay();
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const formatDate = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const handleDayClick = (dateStr: string) => {
    if (tripType === 'round') {
      if (!selectedDate || (selectedDate && selectedReturnDate)) {
        setSelectedDate(dateStr);
        setSelectedReturnDate('');
      } else {
        if (dateStr >= selectedDate) { setSelectedReturnDate(dateStr); }
        else { setSelectedDate(dateStr); setSelectedReturnDate(''); }
      }
    } else {
      setSelectedDate(dateStr);
    }
  };

  const handleConfirm = () => {
    navigate('search-home');
  };

  const canConfirm = !!selectedDate && (tripType === 'oneway' || !!selectedReturnDate);

  return (
    <div className="overlay" aria-label={t('date.overlay.aria')}>
      <div className="overlay-content">
        <div className="header-row">
          <Text variant="title-2" as="h2">{t('date.title')}</Text>
          <IconButton icon="close" onClick={() => navigate('search-home')} ariaLabel={t('common.back.aria')} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {months.map(m => {
            const days = getDaysInMonth(m.year, m.month);
            const startDay = getStartDay(m.year, m.month);
            const cells: React.ReactNode[] = [];
            for (let i = 0; i < startDay; i++) cells.push(<div key={`e${i}`} />);
            for (let d = 1; d <= days; d++) {
              const dateStr = formatDate(m.year, m.month, d);
              const dateObj = new Date(m.year, m.month, d);
              const isPast = dateObj < today;
              const isSelected = dateStr === selectedDate || dateStr === selectedReturnDate;
              const inRange = tripType === 'round' && selectedDate && selectedReturnDate && dateStr > selectedDate && dateStr < selectedReturnDate;
              cells.push(
                <button
                  key={d}
                  type="button"
                  disabled={isPast}
                  onClick={() => handleDayClick(dateStr)}
                  aria-label={`${d}/${m.month + 1}/${m.year}`}
                  style={{
                    width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: 'var(--radius-008)', fontSize: 13, fontWeight: isSelected ? 700 : 400,
                    background: isSelected ? 'var(--main-primary)' : inRange ? 'rgba(106,0,200,0.08)' : 'transparent',
                    color: isSelected ? 'var(--common-100)' : isPast ? 'var(--label-disable)' : 'var(--label-normal)',
                    cursor: isPast ? 'not-allowed' : 'pointer',
                  }}
                >
                  {d}
                </button>
              );
            }
            return (
              <div key={`${m.year}-${m.month}`} style={{ marginBottom: 'var(--gap-020)' }}>
                <Text variant="headline" as="h3">{m.label}</Text>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginTop: 'var(--gap-008)' }}>
                  {cells}
                </div>
              </div>
            );
          })}
        </div>

        <Button variant="gradient" disabled={!canConfirm} onClick={handleConfirm} ariaLabel={t('date.confirm.aria')}>
          {t('date.confirm')}
        </Button>
      </div>
    </div>
  );
}
