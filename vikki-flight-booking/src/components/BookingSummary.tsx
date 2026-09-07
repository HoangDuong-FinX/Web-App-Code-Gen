import React from 'react';
import { t, formatVnd } from '../i18n';
import type { AppState } from '../types/state';
import { calculateTotal } from '../utils/price';
import { Divider } from './Divider';

export interface BookingSummaryProps {
  state: AppState;
}

export function BookingSummary({ state }: BookingSummaryProps): React.ReactElement {
  const total = calculateTotal(state);
  const { selectedOutboundOffer, selectedReturnOffer, tripType } = state;

  return (
    <div
      style={{
        background: 'var(--gray-50)',
        borderRadius: 'var(--radius-12)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
      aria-label="Tóm tắt đặt chỗ"
    >
      <p style={{ font: 'var(--text-headline)', margin: 0 }}>Tóm tắt đặt chỗ</p>
      <Divider />
      {selectedOutboundOffer && (
        <div style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--text-body)' }}>
          <span>{selectedOutboundOffer.origin} → {selectedOutboundOffer.destination}</span>
          <span>{formatVnd(selectedOutboundOffer.priceAmount)}</span>
        </div>
      )}
      {tripType === 'round-trip' && selectedReturnOffer && (
        <div style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--text-body)' }}>
          <span>{selectedReturnOffer.origin} → {selectedReturnOffer.destination}</span>
          <span>{formatVnd(selectedReturnOffer.priceAmount)}</span>
        </div>
      )}
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--text-body-semibold)' }}>
        <span>{t('common.total')}</span>
        <span>{formatVnd(total)}</span>
      </div>
    </div>
  );
}
