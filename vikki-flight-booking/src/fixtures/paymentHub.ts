// Fixture module for the Host Payment Hub (sdk.payment.*)
// Since the Hub runs inside the Host runtime, this fixture stands in for it.
// Callers set the outcome before triggering payment.

export type PaymentOutcome = 'success' | 'failed' | 'cancelled' | 'unavailable';

let paymentOutcome: PaymentOutcome = 'success';

export function setPaymentOutcome(o: PaymentOutcome) {
  paymentOutcome = o;
}

export function getPaymentOutcome(): PaymentOutcome {
  return paymentOutcome;
}

export interface StartPaymentParams {
  transactionType: 'booking';
  provider: 'VJA';
  sessionId: string;
  offerId: string;
}

export interface PaymentSessionResult {
  paymentSessionId: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
}

export interface PollingResult {
  transactionId: string;
  status: 'success' | 'failed';
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function startPayment(params: StartPaymentParams): Promise<PaymentSessionResult> {
  await delay(500);

  if (paymentOutcome === 'unavailable') {
    throw new Error('PAYMENT_HUB_UNAVAILABLE');
  }

  if (paymentOutcome === 'cancelled') {
    return { paymentSessionId: '', status: 'cancelled' };
  }

  if (paymentOutcome === 'failed') {
    return {
      paymentSessionId: `psess_${params.sessionId}`,
      status: 'failed',
    };
  }

  return {
    paymentSessionId: `psess_${params.sessionId}`,
    status: 'success',
  };
}

export async function pollPaymentResult(_paymentSessionId: string): Promise<PollingResult> {
  await delay(300);

  if (paymentOutcome === 'failed') {
    return { transactionId: '', status: 'failed' };
  }

  const transactionId = `TXN${Date.now().toString(36).toUpperCase()}`;
  return { transactionId, status: 'success' };
}
