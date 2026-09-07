// Fixture: Payment inquiry payload
// Waiting on: GET /internal/vja/sessions/{id}/payment-inquiry-payload

export interface PaymentInquiryPayload {
  bookingKey: string;
  amount: number;
}

type PaymentInquiryOutcome = 'success' | 'fail';
let _outcome: PaymentInquiryOutcome = 'success';

export function setPaymentInquiryOutcome(o: PaymentInquiryOutcome): void {
  _outcome = o;
}

export async function fixtureLoadPaymentInquiry(
  _sessionId: string,
  amount: number,
): Promise<PaymentInquiryPayload> {
  await new Promise(r => setTimeout(r, 300));
  if (_outcome === 'fail') throw new Error('fixture: payment-inquiry failed');
  const bookingKey = `VJA${Math.random().toString(36).toUpperCase().slice(2, 10)}`;
  return { bookingKey, amount };
}
