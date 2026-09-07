// Payment inquiry fixture
type FixtureOutcome = 'success' | 'fail';
let inquiryOutcome: FixtureOutcome = 'success';
let paymentOutcome: 'success' | 'fail' | 'cancelled' | 'partial' | 'simulated' = 'simulated';

export function setPaymentInquiryOutcome(o: FixtureOutcome): void { inquiryOutcome = o; }
export function setPaymentOutcome(
  o: 'success' | 'fail' | 'cancelled' | 'partial' | 'simulated'
): void { paymentOutcome = o; }

export interface PaymentInquiryPayload {
  bookingKey: string;
  amount: number;
}

export async function fetchPaymentInquiry(amount: number): Promise<PaymentInquiryPayload> {
  await new Promise(r => setTimeout(r, 400));
  if (inquiryOutcome === 'fail') throw new Error('fixture: fetch-payment-inquiry failed');
  return { bookingKey: `VJA${Math.random().toString(36).slice(2, 10).toUpperCase()}`, amount };
}

export interface PaymentResult {
  paymentResult: 'success' | 'failed' | 'partial' | 'simulated';
  transactionId?: string;
  bookingCode?: string;
  errorMessage?: string;
  viaHost: boolean;
}

export async function initiatePayment(amount: number): Promise<PaymentResult> {
  await new Promise(r => setTimeout(r, 1200));
  const bookingCode = Math.random().toString(36).slice(2, 10).toUpperCase().slice(0, 8);
  if (paymentOutcome === 'fail') {
    return { paymentResult: 'failed', errorMessage: 'Thanh toán bị từ chối', viaHost: false };
  }
  if (paymentOutcome === 'partial') {
    return { paymentResult: 'partial', bookingCode, viaHost: false };
  }
  if (paymentOutcome === 'cancelled') {
    // Cancelled means stay on checkout — throw a special error
    throw Object.assign(new Error('PAYMENT_CANCELLED'), { code: 'PAYMENT_CANCELLED' });
  }
  // success or simulated
  const txId = `TXN${Date.now()}`;
  return {
    paymentResult: paymentOutcome === 'simulated' ? 'simulated' : 'success',
    transactionId: txId,
    bookingCode,
    viaHost: false,
  };
}
