import type { PaymentResult } from '../types';

interface SdkPayment {
  startPayment(params: {
    transactionType: string;
    provider: string;
    sessionId: string;
    offerId: string;
  }): Promise<PaymentResult>;
  polling(params: { paymentSessionId: string }): Promise<{ transactionId?: string }>;
}

function getSdkPayment(): SdkPayment | null {
  const w = window as unknown as { sdk?: { payment?: SdkPayment } };
  return w.sdk?.payment ?? null;
}

export async function startPayment(params: {
  sessionId: string;
  offerId: string;
}): Promise<PaymentResult> {
  const sdk = getSdkPayment();
  if (!sdk) {
    return {
      isSuccess: true,
      paymentSessionId: `sim_${Date.now()}`,
    };
  }
  return sdk.startPayment({
    transactionType: 'booking',
    provider: 'VJA',
    sessionId: params.sessionId,
    offerId: params.offerId,
  });
}

export async function pollTransactionId(paymentSessionId: string): Promise<string | null> {
  const sdk = getSdkPayment();
  if (!sdk) {
    return null;
  }
  try {
    const result = await sdk.polling({ paymentSessionId });
    return result.transactionId ?? null;
  } catch {
    return null;
  }
}
