import type { Dealer, TimeSlot } from "../types";

export const FIXTURE_DEALERS: Dealer[] = [
  { id: "d1", name: "AutoMart Quan 1", address: "123 Nguyen Hue, Quan 1, TP.HCM", phone: "028-1234-5678" },
  { id: "d2", name: "AutoMart Quan 7", address: "456 Nguyen Van Linh, Quan 7, TP.HCM", phone: "028-2345-6789" },
  { id: "d3", name: "AutoMart Ha Noi", address: "789 Pham Hung, Cau Giay, Ha Noi", phone: "024-3456-7890" },
];

let testDriveBookingOutcome: "success" | "fail" = "success";
export function setTestDriveBookingOutcome(o: "success" | "fail"): void {
  testDriveBookingOutcome = o;
}
export function getTestDriveBookingOutcome(): "success" | "fail" {
  return testDriveBookingOutcome;
}

export function getAvailableSlots(): TimeSlot[] {
  return [
    { time: "08:00", available: true },
    { time: "09:00", available: true },
    { time: "10:00", available: false },
    { time: "11:00", available: true },
    { time: "13:00", available: true },
    { time: "14:00", available: false },
    { time: "15:00", available: true },
    { time: "16:00", available: true },
  ];
}
