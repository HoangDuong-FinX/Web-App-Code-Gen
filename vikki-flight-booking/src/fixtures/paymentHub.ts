// Fixture: Payment Hub (sdk.payment)
// Waiting on: Host runtime sdk.payment.startPayment / sdk.payment.polling
// BR-12: when Hub unavailable, show simulated banner. Never silently claim success.

export type PaymentHubOutcome = 'success' | 'fail' | 'cancelled' | 'simulated';
let _outcome: PaymentHubOutcome = 'simulated';

export function setPaymentHubOutcome(o: PaymentHubOutcome): void {
  _outcome = o;
}

export function getPaymentHubOutcome(): PaymentHubOutcome {
  return _outcome;
}

export interface StartPaymentResult {
  paymentSessionId: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  transactionId?: string;
  viaHost: boolean;
  errorMessage?: string;
}

export async function fixtureStartPayment(params: {
  transactionType: string;
  provider: string;
  sessionId: string;
  offerId: string;
}): Promise<StartPaymentResult> {
  // Verify correct provider constant per C-01
  if (params.provider !== 'VJA') throw new Error('provider must be VJA');
  if (params.transactionType !== 'booking') throw new Error('transactionType must be booking');

  await new Promise(r => setTimeout(r, 800));

  switch (_outcome) {
    case 'success':
      return {
        paymentSessionId: `psess_${Date.now()}`,
        status: 'success',
        transactionId: `TXN${Date.now().toString().slice(-8)}`,
        viaHost: true,
      };
    case 'fail':
      return {
        paymentSessionId: `psess_${Date.now()}`,
        status: 'failed',
        viaHost: true,
        errorMessage: 'Thẻ bị từ chối',
      };
    case 'cancelled':
      return {
        paymentSessionId: `psess_${Date.now()}`,
        status: 'cancelled',
        viaHost: true,
      };
    case 'simulated':
    default:
      // Hub unavailable — fallback per BR-12
      return {
        paymentSessionId: `psess_sim_${Date.now()}`,
        status: 'success',
        transactionId: undefined,
        viaHost: false,
      };
  }
}
