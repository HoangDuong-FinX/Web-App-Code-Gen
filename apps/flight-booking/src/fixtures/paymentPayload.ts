import type { PaymentPayload } from '../types';

let shouldFail = false;
let shouldMissingKey = false;

export function setLoadPaymentPayloadOutcome(outcome: 'success' | 'fail' | 'noKey'): void {
  shouldFail = outcome === 'fail';
  shouldMissingKey = outcome === 'noKey';
}

export function loadPaymentPayloadFixture(amount: number): Promise<PaymentPayload> {
  if (shouldFail) {
    return Promise.reject(new Error('fixture: payment payload load failed'));
  }
  if (shouldMissingKey) {
    return Promise.resolve({ bookingKey: '', amount });
  }
  return Promise.resolve({
    bookingKey: 'BK_' + Date.now().toString(36).toUpperCase(),
    amount,
  });
}