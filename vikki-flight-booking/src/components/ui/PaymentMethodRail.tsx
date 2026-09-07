import React from 'react';
import { t } from '../../i18n';

export function PaymentMethodRail({ 'data-testid': testId }: { 'data-testid'?: string }) {
  return (
    <div
      data-testid={testId}
      className="rounded-xl border border-[var(--gray-200)] px-4 py-3 bg-[var(--gray-50)]"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden>💳</span>
        <div>
          <div className="text-[14px] font-semibold text-[var(--gray-900)]">
            {t('checkout.paymentMethod')}
          </div>
          <div className="text-[12px] text-[var(--gray-500)]">
            Được quản lý bởi Vikki Payment Hub
          </div>
        </div>
      </div>
    </div>
  );
}
