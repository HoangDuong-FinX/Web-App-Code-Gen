// Screen: slot-picker — Select date and time slot for a branch
import React, { useState, useEffect, useCallback } from 'react';
import { t } from '../i18n';
import { apiRequest } from '../api/client';
import { ErrorState } from '../components/ErrorState';
import type { Branch, TimeSlot } from '../types';

interface SlotPickerProps {
  branch: Branch;
  onContinue: (date: string, slotId: string, slotTimeRange: string) => void;
  onBack: () => void;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getMinDate(): string {
  return formatDate(new Date());
}

function getMaxDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return formatDate(d);
}

export const SlotPicker: React.FC<SlotPickerProps> = ({ branch, onContinue, onBack }) => {
  const [selectedDate, setSelectedDate] = useState<string>(getMinDate());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const loadSlots = useCallback(async (date: string) => {
    setLoading(true);
    setError(false);
    setSelectedSlotId(null);
    try {
      const data = await apiRequest<{ slots: TimeSlot[] }>({
        method: 'GET',
        path: `/branches/${encodeURIComponent(branch.id)}/slots?date=${encodeURIComponent(date)}`,
      });
      setSlots(data.slots);
    } catch {
      setError(true);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, [branch.id]);

  useEffect(() => {
    if (selectedDate) {
      loadSlots(selectedDate);
    }
  }, [selectedDate, loadSlots]);

  const selectedSlot = slots.find((s) => s.slotId === selectedSlotId);
  const canContinue = selectedDate && selectedSlotId && selectedSlot;

  const handleContinue = () => {
    if (canContinue && selectedSlot) {
      onContinue(selectedDate, selectedSlot.slotId, `${selectedSlot.startTime} - ${selectedSlot.endTime}`);
    }
  };

  return (
    <div className="stack-col gap-4">
      <h1 className="text-title">{t('slotPicker.title')}</h1>

      <div className="stack-col gap-1">
        <span className="text-subtitle">{branch.name}</span>
        <span className="text-caption text-secondary">{branch.address}</span>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="date-picker">
          {t('slotPicker.dateLabel')}
        </label>
        <input
          id="date-picker"
          className="date-input"
          type="date"
          aria-label={t('slotPicker.dateLabel')}
          min={getMinDate()}
          max={getMaxDate()}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          required
        />
      </div>

      {loading && (
        <div className="loading-container" role="status" aria-label={t('common.loading')}>
          <div className="spinner" />
        </div>
      )}

      {error && !loading && (
        <ErrorState
          title={t('slotPicker.errorTitle')}
          description={t('slotPicker.errorDescription')}
          retryLabel={t('slotPicker.retry')}
          onRetry={() => loadSlots(selectedDate)}
          ariaLabel={t('slotPicker.errorTitle')}
        />
      )}

      {!loading && !error && selectedDate && (
        <div className="stack-col gap-2">
          <span className="text-subtitle">{t('slotPicker.slotsHeading')}</span>
          {slots.length === 0 ? (
            <p className="text-body text-secondary" role="status" aria-label={t('slotPicker.noSlots')}>
              {t('slotPicker.noSlots')}
            </p>
          ) : (
            <div className="chip-grid" role="radiogroup" aria-label={t('slotPicker.slotsHeading')}>
              {slots.map((slot) => {
                const remaining = slot.capacity - slot.booked;
                const isFull = remaining <= 0;
                const isSelected = slot.slotId === selectedSlotId;
                const timeRange = `${slot.startTime} - ${slot.endTime}`;
                return (
                  <button
                    key={slot.slotId}
                    className={`chip ${isSelected ? 'chip-selected' : ''} ${isFull ? 'chip-disabled' : ''}`}
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`${timeRange}, ${t('slotPicker.slotRemaining', { remaining: String(remaining) })}`}
                    disabled={isFull}
                    onClick={() => setSelectedSlotId(slot.slotId)}
                  >
                    <span className="chip-time">{timeRange}</span>
                    <span className="chip-capacity">
                      {t('slotPicker.slotRemaining', { remaining: String(remaining) })}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <button
        className="btn btn-primary"
        aria-label={t('slotPicker.continue')}
        disabled={!canContinue}
        onClick={handleContinue}
      >
        {t('slotPicker.continue')}
      </button>

      <button
        className="btn btn-text"
        aria-label={t('slotPicker.back')}
        onClick={onBack}
      >
        {t('slotPicker.back')}
      </button>
    </div>
  );
};
