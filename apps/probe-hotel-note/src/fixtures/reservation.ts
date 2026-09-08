import type { ReservationTerms, ReservationResult } from '../types';

type InquiryOutcome = 'success' | 'fail';
let inquiryOutcome: InquiryOutcome = 'success';

export function setInquiryOutcome(outcome: InquiryOutcome): void {
  inquiryOutcome = outcome;
}

export function simulateSubmitInquiry(): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: inquiryOutcome === 'success' });
    }, 300);
  });
}

type TestDriveOutcome = 'success' | 'slotUnavailable' | 'networkError';
let testDriveOutcome: TestDriveOutcome = 'success';

export function setTestDriveOutcome(outcome: TestDriveOutcome): void {
  testDriveOutcome = outcome;
}

export function simulateBookTestDrive(): Promise<{
  success: boolean;
  slotUnavailable: boolean;
  networkError: boolean;
  referenceCode: string;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (testDriveOutcome === 'slotUnavailable') {
        resolve({ success: false, slotUnavailable: true, networkError: false, referenceCode: '' });
      } else if (testDriveOutcome === 'networkError') {
        resolve({ success: false, slotUnavailable: false, networkError: true, referenceCode: '' });
      } else {
        resolve({ success: true, slotUnavailable: false, networkError: false, referenceCode: 'TD-20240120-001' });
      }
    }, 300);
  });
}

type PaymentOutcome = 'success' | 'declined' | 'carUnavailable';
let paymentOutcome: PaymentOutcome = 'success';

export function setPaymentOutcome(outcome: PaymentOutcome): void {
  paymentOutcome = outcome;
}

export const reservationTermsData: ReservationTerms = {
  depositAmount: '50.000.000 \u20ab',
  holdPeriod: '30 ng\u00e0y',
  cancellationPolicy: 'Ho\u00e0n 100% ti\u1ec1n c\u1ecdc n\u1ebfu h\u1ee7y trong 48 gi\u1edd \u0111\u1ea7u. Sau 48 gi\u1edd, ph\u00ed h\u1ee7y 10% ti\u1ec1n c\u1ecdc.',
};

export function simulatePayment(): Promise<{
  success: boolean;
  declined: boolean;
  carUnavailable: boolean;
  result: ReservationResult | null;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (paymentOutcome === 'declined') {
        resolve({ success: false, declined: true, carUnavailable: false, result: null });
      } else if (paymentOutcome === 'carUnavailable') {
        resolve({ success: false, declined: false, carUnavailable: true, result: null });
      } else {
        resolve({
          success: true, declined: false, carUnavailable: false,
          result: { code: 'RES-20240118-003', depositAmountPaid: '50.000.000 \u20ab', holdUntilDate: '18/02/2024', nextStepsMessage: '\u0110\u1ea1i l\u00fd s\u1ebd li\u00ean h\u1ec7 b\u1ea1n trong 24 gi\u1edd.' },
        });
      }
    }, 300);
  });
}
