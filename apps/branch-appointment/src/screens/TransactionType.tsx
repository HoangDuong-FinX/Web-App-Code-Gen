// Screen: transaction-type — Select transaction type
import React, { useState } from 'react';
import { t } from '../i18n';
import type { TransactionType as TxType } from '../types';

interface TransactionTypeProps {
  branchName: string;
  date: string;
  slotTimeRange: string;
  initialValue: TxType | null;
  onContinue: (txType: TxType) => void;
  onBack: () => void;
}

interface TxOption {
  value: TxType;
  labelKey: string;
}

const TX_OPTIONS: TxOption[] = [
  { value: 'open-card', labelKey: 'transactionType.openCard' },
  { value: 'close-account', labelKey: 'transactionType.closeAccount' },
  { value: 'loan-consultation', labelKey: 'transactionType.loanConsultation' },
];

export const TransactionType: React.FC<TransactionTypeProps> = ({
  branchName,
  date,
  slotTimeRange,
  initialValue,
  onContinue,
  onBack,
}) => {
  const [selected, setSelected] = useState<TxType | null>(initialValue);

  return (
    <div className="stack-col gap-4">
      <h1 className="text-title">{t('transactionType.title')}</h1>

      <div className="stack-col gap-1">
        <span className="text-body">{branchName}</span>
        <span className="text-caption text-secondary">
          {date} &middot; {slotTimeRange}
        </span>
      </div>

      <fieldset style={{ border: 'none', padding: 0 }}>
        <legend className="form-label" style={{ marginBottom: 'var(--space-3)' }}>
          {t('transactionType.label')}
        </legend>
        <div className="radio-group" role="radiogroup" aria-label={t('transactionType.label')}>
          {TX_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`radio-option ${selected === opt.value ? 'radio-option-selected' : ''}`}
            >
              <input
                type="radio"
                name="transaction-type"
                value={opt.value}
                checked={selected === opt.value}
                onChange={() => setSelected(opt.value)}
                aria-label={t(opt.labelKey)}
              />
              <span className="radio-option-label">{t(opt.labelKey)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <button
        className="btn btn-primary"
        aria-label={t('transactionType.continue')}
        disabled={selected === null}
        onClick={() => selected && onContinue(selected)}
      >
        {t('transactionType.continue')}
      </button>

      <button
        className="btn btn-text"
        aria-label={t('transactionType.back')}
        onClick={onBack}
      >
        {t('transactionType.back')}
      </button>
    </div>
  );
};
