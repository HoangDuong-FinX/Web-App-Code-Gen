import type { ReservationTerms, ReservationResult } from "../types";

export const reservationTermsData: ReservationTerms = {
  depositAmount: "50.000.000 ₫",
  holdPeriod: "30 ngày",
  cancellationPolicy:
    "Hoàn 100% tiền cọc nếu hủy trong 48 giờ đầu. Sau 48 giờ, phí hủy 10% tiền cọc.",
};

type InquiryOutcome = "success" | "fail";
let inquiryOutcome: InquiryOutcome = "success";

export function setInquiryOutcome(outcome: InquiryOutcome): void {
  inquiryOutcome = outcome;
}

export function simulateSubmitInquiry(): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: inquiryOutcome === "success" });
    }, 800);
  });
}

type TestDriveOutcome = "success" | "slotUnavailable" | "networkError";
let testDriveOutcome: TestDriveOutcome = "success";

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
      if (testDriveOutcome === "slotUnavailable") {
        resolve({ success: false, slotUnavailable: true, networkError: false, referenceCode: "" });
      } else if (testDriveOutcome === "networkError") {
        resolve({ success: false, slotUnavailable: false, networkError: true, referenceCode: "" });
      } else {
        resolve({
          success: true,
          slotUnavailable: false,
          networkError: false,
          referenceCode: "TD-20240120-001",
        });
      }
    }, 800);
  });
}

type PaymentOutcome = "success" | "declined" | "carUnavailable";
let paymentOutcome: PaymentOutcome = "success";

export function setPaymentOutcome(outcome: PaymentOutcome): void {
  paymentOutcome = outcome;
}

export function simulatePayment(): Promise<{
  success: boolean;
  declined: boolean;
  carUnavailable: boolean;
  result: ReservationResult | null;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (paymentOutcome === "declined") {
        resolve({ success: false, declined: true, carUnavailable: false, result: null });
      } else if (paymentOutcome === "carUnavailable") {
        resolve({ success: false, declined: false, carUnavailable: true, result: null });
      } else {
        resolve({
          success: true,
          declined: false,
          carUnavailable: false,
          result: {
            code: "RES-20240118-003",
            depositAmountPaid: "50.000.000 ₫",
            holdUntilDate: "18/02/2024",
            nextStepsMessage:
              "Đại lý sẽ liên hệ bạn trong 24 giờ để hoàn tất thủ tục mua xe.",
          },
        });
      }
    }, 1200);
  });
}
