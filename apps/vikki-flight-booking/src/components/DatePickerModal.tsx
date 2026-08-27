import React, { useState } from 'react';
import { useI18n } from '../i18n';
import { Modal } from './Modal';

interface DatePickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  initialDate?: string;
}

export function DatePickerModal({ open, onClose, onSelect, minDate, maxDate, initialDate }: DatePickerModalProps) {
  const { t } = useI18n();
  const [selectedDate, setSelectedDate] = useState(initialDate ?? '');

  const handleConfirm = () => {
    if (selectedDate) {
      onSelect(selectedDate);
      onClose();
    }
  };

  return (
    <Modal open={open} title={t('datePicker.title')} onClose={onClose}>
      <input
        type="date"
        className="date-picker__input"
        value={selectedDate}
        min={minDate}
        max={maxDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        aria-label={t('datePicker.title')}
      />
      <button
        className="date-picker__confirm btn-big btn-big--active"
        onClick={handleConfirm}
        disabled={!selectedDate}
        type="button"
      >
        {t('datePicker.confirm')}
      </button>
    </Modal>
  );
}

