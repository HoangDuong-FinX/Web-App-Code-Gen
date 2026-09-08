import type { ReservationTerms, ReservationResult } from '../types';

let reservationTermsOutcome: 'success' | 'fail' = 'success';
export function setReservationTermsOutcome(v: 'success' | 'fail'): void { reservationTermsOutcome = v; }

let paymentOutcome: 'success' | 'declined' | 'carUnavailable' | 'timeout' | 'capabilityUnavailable' = 'success';
export function setPaymentOutcome(v: 'success' | 'declined' | 'carUnavailable' | 'timeout' | 'capabilityUnavailable'): void { paymentOutcome = v; }

let inquirySubmitOutcome: 'success' | 'fail' = 'success';
export function setInquirySubmitOutcome(v: 'success' | 'fail'): void { inquirySubmitOutcome = v; }

let testDriveSubmitOutcome: 'success' | 'slotUnavailable' | 'networkError' = 'success';
export function setTestDriveSubmitOutcome(v: 'success' | 'slotUnavailable' | 'networkError'): void { testDriveSubmitOutcome = v; }

export async function loadReservationTerms(): Promise<ReservationTerms> {
  await new Promise(r => setTimeout(r, 300));
  if (reservationTermsOutcome === 'fail') throw new Error('Network error');
  return {
    depositAmount: '50.000.000 ₫',
    holdPeriod: '7 ngày',
    cancellationPolicy: 'Hoàn 100% tiền cọc nếu hủy trong 24 giờ đầu tiên. Sau 24 giờ, phí hủy là 10% số tiền đặt cọc.',
  };
}

export async function startDepositPayment(): Promise<{ transactionId: string; status: string }> {
  await new Promise(r => setTimeout(r, 1000));
  if (paymentOutcome === 'declined') throw new Error('PAYMENT_DECLINED');
  if (paymentOutcome === 'carUnavailable') throw new Error('CAR_UNAVAILABLE');
  if (paymentOutcome === 'timeout') throw new Error('PAYMENT_TIMEOUT');
  if (paymentOutcome === 'capabilityUnavailable') throw new Error('CAPABILITY_UNAVAILABLE');
  return { transactionId: 'txn-001', status: 'success' };
}

export async function createReservation(): Promise<ReservationResult> {
  await new Promise(r => setTimeout(r, 300));
  return {
    code: 'RES-20240120-001',
    holdUntilDate: '27/01/2024',
    depositAmountPaid: '50.000.000 ₫',
    nextStepsMessage: 'Đại lý sẽ liên hệ bạn trong 24 giờ để hoàn tất thủ tục mua xe. Vui lòng giữ liên lạc.',
  };
}

export async function submitInquiry(): Promise<{ inquiryId: string }> {
  await new Promise(r => setTimeout(r, 500));
  if (inquirySubmitOutcome === 'fail') throw new Error('Network error');
  return { inquiryId: 'inq-new-001' };
}

export async function submitTestDrive(): Promise<{ referenceCode: string }> {
  await new Promise(r => setTimeout(r, 500));
  if (testDriveSubmitOutcome === 'slotUnavailable') throw new Error('SLOT_UNAVAILABLE');
  if (testDriveSubmitOutcome === 'networkError') throw new Error('NETWORK_ERROR');
  return { referenceCode: 'TD-20240120-001' };
}
