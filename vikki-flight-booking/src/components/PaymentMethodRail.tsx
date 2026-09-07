import React from 'react';
import { t } from '../i18n';

// PaymentMethodRail: controlled by Host Payment Hub in production.
// In standalone mode, shows a placeholder noting the Hub is unavailable.
export function PaymentMethodRail({
  'data-testid': testId,
}: {
  'data-testid'?: string;
}): React.ReactElement {
  return (
    <div
      data-testid={testId}
      style={{
        padding: '12px',
        borderRadius: 'var(--radius-8)',
        border: '1.5px dashed var(--gray-300)',
        background: 'var(--gray-50)',
        color: 'var(--color-text-secondary)',
        font: 'var(--text-body)',
        textAlign: 'center',
      }}
    >
      {t('checkout.paymentMethod.placeholder')}
    </div>
  );
}
