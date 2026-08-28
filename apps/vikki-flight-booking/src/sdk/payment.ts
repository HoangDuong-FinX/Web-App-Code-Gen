import { PaymentResult, PaymentPollingResult } from '../types';

interface SdkPayment {
  startPayment: (params: {
    transactionType: string;
    provider: string;
    sessionId: string;
    offerId: string;
  }) => Promise<{ isSuccess: boolean; data?: unknown; cancelled?: boolean; message?: string }>;
  polling: (params: { paymentSessionId: string }) => Promise<{ isSuccess: boolean; data?: unknown }>;
}

function getSdkPayment(): SdkPayment | null {
  const win = window as unknown as { sdk?: { payment?: SdkPayment } };
  return win.sdk?.payment ?? null;
}

export async function startPayment(sessionId: string, offerId: string): Promise<PaymentResult> {
  const sdk = getSdkPayment();
  if (!sdk) {
    return {
      paymentSessionId: 'sim_ps_001',
      transactionId: null,
      settledAt: new Date().toISOString(),
      viaHost: false,
      bookingCode: `VJ${Date.now().toString(36).toUpperCase()}`,
    };
  }
  const response = await sdk.startPayment({
    transactionType: 'booking',
    provider: 'VJA',
    sessionId,
    offerId,
  });
  if (response.cancelled) {
    throw new PaymentCancelledError();
  }
  if (!response.isSuccess) {
    throw new PaymentFailedError(response.message ?? 'Payment failed');
  }
  return response.data as PaymentResult;
}

export async function pollTransaction(paymentSessionId: string): Promise<PaymentPollingResult | null> {
  const sdk = getSdkPayment();
  if (!sdk) {
    return null;
  }
  const response = await sdk.polling({ paymentSessionId });
  if (!response.isSuccess) {
    return null;
  }
  return response.data as PaymentPollingResult;
}

export class PaymentCancelledError extends Error {
  constructor() {
    super('Payment cancelled by user');
    this.name = 'PaymentCancelledError';
  }
}

export class PaymentFailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaymentFailedError';
  }
}
