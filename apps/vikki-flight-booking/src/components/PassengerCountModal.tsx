import React, { useState } from 'react';
import { useI18n } from '../i18n';
import { Modal } from './Modal';
import type { PassengerCount } from '../types';

interface PassengerCountModalProps {
  open: boolean;
  onClose: () => void;
  value: PassengerCount;
  onConfirm: (count: PassengerCount) => void;
}

export function PassengerCountModal({ open, onClose, value, onConfirm }: PassengerCountModalProps) {
  const { t } = useI18n();
  const [count, setCount] = useState<PassengerCount>(value);

  const total = count.adults + count.children + count.infants;
  const maxReached = total >= 4;

  const adjust = (field: keyof PassengerCount, delta: number) => {
    setCount((prev) => {
      const newVal = prev[field] + delta;
      if (field === 'adults' && (newVal < 1 || newVal > 4)) return prev;
      if (field === 'children' && (newVal < 0 || newVal > 3)) return prev;
      if (field === 'infants' && (newVal < 0 || newVal > 2)) return prev;
      const newCount = { ...prev, [field]: newVal };
      if (newCount.adults + newCount.children + newCount.infants > 4) return prev;
      return newCount;
    });
  };

  const handleConfirm = () => {
    onConfirm(count);
    onClose();
  };

  return (
    <Modal open={open} title={t('paxCount.title')} onClose={onClose}>
      <div className="pax-count">
        <div className="pax-count__row">
          <span>{t('paxCount.adults')}</span>
          <div className="pax-count__controls">
            <button onClick={() => adjust('adults', -1)} disabled={count.adults <= 1} type="button" aria-label={`Decrease adults`}>-</button>
            <span aria-live="polite">{count.adults}</span>
            <button onClick={() => adjust('adults', 1)} disabled={maxReached} type="button" aria-label={`Increase adults`}>+</button>
          </div>
        </div>
        <div className="pax-count__row">
          <span>{t('paxCount.children')}</span>
          <div className="pax-count__controls">
            <button onClick={() => adjust('children', -1)} disabled={count.children <= 0} type="button" aria-label={`Decrease children`}>-</button>
            <span aria-live="polite">{count.children}</span>
            <button onClick={() => adjust('children', 1)} disabled={maxReached} type="button" aria-label={`Increase children`}>+</button>
          </div>
        </div>
        <div className="pax-count__row">
          <span>{t('paxCount.infants')}</span>
          <div className="pax-count__controls">
            <button onClick={() => adjust('infants', -1)} disabled={count.infants <= 0} type="button" aria-label={`Decrease infants`}>-</button>
            <span aria-live="polite">{count.infants}</span>
            <button onClick={() => adjust('infants', 1)} disabled={maxReached} type="button" aria-label={`Increase infants`}>+</button>
          </div>
        </div>
        {maxReached && <p className="pax-count__max-notice">{t('paxCount.max')}</p>}
        <button className="btn-big btn-big--active" onClick={handleConfirm} type="button">
          {t('paxCount.confirm')}
        </button>
      </div>
    </Modal>
  );
}
