import type { Order, OrderDetail, AdminOrder, AdminOrderDetail } from "../types";

let depositPaymentOutcome: "success" | "fail" = "success";
export function setDepositPaymentOutcome(o: "success" | "fail"): void {
  depositPaymentOutcome = o;
}
export function getDepositPaymentOutcome(): "success" | "fail" {
  return depositPaymentOutcome;
}

let cancelDepositOutcome: "success" | "fail" = "success";
export function setCancelDepositOutcome(o: "success" | "fail"): void {
  cancelDepositOutcome = o;
}
export function getCancelDepositOutcome(): "success" | "fail" {
  return cancelDepositOutcome;
}

export const FIXTURE_ORDERS: Order[] = [
  { id: "ord-001", orderCode: "AM-20240901-001", carName: "Toyota Camry 2.5Q", carThumbnailUrl: "https://placehold.co/100x70/1a1a2e/eaeaea?text=Camry", depositAmount: 50000000, status: "processing", createdAt: "2024-09-01T10:30:00Z" },
  { id: "ord-002", orderCode: "AM-20240825-002", carName: "Honda CR-V L", carThumbnailUrl: "https://placehold.co/100x70/16213e/eaeaea?text=CRV", depositAmount: 30000000, status: "confirmed", createdAt: "2024-08-25T14:00:00Z" },
  { id: "ord-003", orderCode: "AM-20240820-003", carName: "Kia Seltos 1.6 Turbo", carThumbnailUrl: "https://placehold.co/100x70/e94560/eaeaea?text=Seltos", depositAmount: 20000000, status: "completed", createdAt: "2024-08-20T09:00:00Z" },
];

export const FIXTURE_ORDER_DETAIL: OrderDetail = {
  id: "ord-001",
  orderCode: "AM-20240901-001",
  status: "processing",
  car: { name: "Toyota Camry 2.5Q", thumbnailUrl: "https://placehold.co/200x140/1a1a2e/eaeaea?text=Camry", variant: "2.5Q", color: "Trang ngoc trai", listedPrice: 1405000000 },
  depositAmount: 50000000,
  timeline: [{ status: "Dat coc", datetime: "01/09/2024 10:30" }, { status: "Dang xu ly", datetime: "01/09/2024 10:30" }],
  dealer: { name: "AutoMart Quan 1", address: "123 Nguyen Hue, Quan 1, TP.HCM", phone: "028-1234-5678" },
  canCancel: true,
  testDrive: { bookingCode: "TD-20240905-001", datetime: "05/09/2024 10:00", canCancel: true },
};

export const FIXTURE_ADMIN_ORDERS: AdminOrder[] = [
  { id: "ord-001", orderCode: "AM-20240901-001", customerName: "Nguyen Van A", carName: "Toyota Camry 2.5Q", depositAmount: 50000000, status: "processing", createdAt: "2024-09-01" },
  { id: "ord-002", orderCode: "AM-20240825-002", customerName: "Tran Thi B", carName: "Honda CR-V L", depositAmount: 30000000, status: "confirmed", createdAt: "2024-08-25" },
  { id: "ord-003", orderCode: "AM-20240820-003", customerName: "Le Van C", carName: "Kia Seltos 1.6 Turbo", depositAmount: 20000000, status: "completed", createdAt: "2024-08-20" },
];

export const FIXTURE_ADMIN_ORDER_DETAIL: AdminOrderDetail = {
  id: "ord-001",
  orderCode: "AM-20240901-001",
  status: "processing",
  customer: { name: "Nguyen Van A", phone: "0901234567", cccd: "012345678901", address: "456 Le Loi, Q.1, TP.HCM" },
  car: { name: "Toyota Camry 2.5Q", variant: "2.5Q", color: "Trang ngoc trai", listedPrice: 1405000000 },
  depositAmount: 50000000,
};
