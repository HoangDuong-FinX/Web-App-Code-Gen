import React, { useState } from 'react';
import { Modal } from '../components/Modal';
import { SegmentedControl } from '../components/SegmentedControl';
import { Button } from '../components/Button';
import { Text } from '../components/Text';
import { t } from '../i18n';
import { formatDateVi, todayPlusDays } from '../utils/date';
import type { TripType } from '../types/state';

interface DatePickerModalProps {
  tripType: TripType;
  departureDate: string;
  returnDate: string;
  onConfirm: (departure: string, returnDate?: string) => void;
  onClose: () => void;
}

export function DatePickerModal({
  tripType,
  departureDate,
  returnDate,
  onConfirm,
  onClose,
}: DatePickerModalProps): React.ReactElement {
  const [tab, setTab] = useState<'departure' | 'return'>('departure');
  const [dep, setDep] = useState(departureDate);
  const [ret, setRet] = useState(returnDate);

  // Build 6-month calendar
  const today = new Date();
  const minDate = today.toISOString().slice(0, 10);
  const maxDate = todayPlusDays(180);

  function getMonthDays(year: number, month: number): Array<{ date: string; day: number; isCurrentMonth: boolean }> {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const days: Array<{ date: string; day: number; isCurrentMonth: boolean }> = [];
    // Pad from Monday
    const startDow = (first.getDay() + 6) % 7;
    for (let i = 0; i < startDow; i++) {
      days.push({ date: '', day: 0, isCurrentMonth: false });
    }
    for (let d = 1; d <= last.getDate(); d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ date: dateStr, day: d, isCurrentMonth: true });
    }
    return days;
  }

  const months: Array<{ year: number; month: number; label: string }> = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    months.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      label: `Tháng ${d.getMonth() + 1} ${d.getFullYear()}`,
    });
  }

  function handleDayClick(date: string) {
    if (date < minDate || date > maxDate) return;
    if (tab === 'departure') {
      setDep(date);
      if (tripType === 'round-trip' && ret < date) {
        const newRet = new Date(date);
        newRet.setDate(newRet.getDate() + 4);
        setRet(newRet.toISOString().slice(0, 10));
      }
    } else {
      if (date >= dep) setRet(date);
    }
  }

  const DOW_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  return (
    <Modal
      title={t('datePicker.title')}
      dismissible
      onClose={onClose}
      data-testid="date-picker-modal"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
        {tripType === 'round-trip' && (
          <SegmentedControl
            options={[
              { label: t('datePicker.departure'), value: 'departure' },
              { label: t('datePicker.return'), value: 'return' },
            ]}
            value={tab}
            onChange={v => setTab(v as 'departure' | 'return')}
            ariaLabel={t('datePicker.title')}
            data-testid="trip-type-tabs"
          />
        )}

        <div style={{ display: 'flex', gap: '8px', font: 'var(--text-body-semibold)' }}>
          <span>{t('datePicker.departure')}: {formatDateVi(dep)}</span>
          {tripType === 'round-trip' && <span>— {t('datePicker.return')}: {formatDateVi(ret)}</span>}
        </div>

        {months.map(({ year, month, label }) => {
          const days = getMonthDays(year, month);
          return (
            <div key={`${year}-${month}`} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Text variant="headline" semantic="h3" data-testid="calendar-grid">{label}</Text>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                {DOW_LABELS.map(d => (
                  <div key={d} style={{ textAlign: 'center', font: 'var(--text-caption-2)', color: 'var(--color-text-secondary)', padding: '4px 0' }}>{d}</div>
                ))}
                {days.map((cell, idx) => {
                  if (!cell.isCurrentMonth) {
                    return <div key={idx} />;
                  }
                  const isPast = cell.date < minDate || cell.date > maxDate;
                  const isDepSelected = cell.date === dep;
                  const isRetSelected = cell.date === ret;
                  const isInRange = tripType === 'round-trip' && cell.date > dep && cell.date < ret;
                  return (
                    <button
                      key={cell.date}
                      type="button"
                      onClick={() => handleDayClick(cell.date)}
                      disabled={isPast}
                      aria-label={`Ngày ${cell.day}`}
                      aria-pressed={isDepSelected || isRetSelected}
                      style={{
                        padding: '6px 2px',
                        borderRadius: 'var(--radius-4)',
                        border: 'none',
                        background: isDepSelected || isRetSelected
                          ? 'var(--color-primary)'
                          : isInRange ? 'var(--color-primary-light)' : 'transparent',
                        color: isDepSelected || isRetSelected
                          ? '#fff'
                          : isPast ? 'var(--color-text-disabled)' : 'var(--color-text-primary)',
                        cursor: isPast ? 'not-allowed' : 'pointer',
                        font: 'var(--text-body)',
                        textAlign: 'center',
                      }}
                    >
                      {cell.day}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        <Button
          variant="primary"
          onClick={() => onConfirm(dep, tripType === 'round-trip' ? ret : undefined)}
          ariaLabel={t('datePicker.confirm.ariaLabel')}
          data-testid="confirm-button"
          fullWidth
        >
          {t('datePicker.confirm')}
        </Button>
      </div>
    </Modal>
  );
}
