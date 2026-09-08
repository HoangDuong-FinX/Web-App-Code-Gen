import type { Order, PaymentMethod } from '../types';

export const sampleOrders: Order[] = [
  {
    id: 'order-001', orderNumber: 'AM-2024-001', carName: 'Toyota Camry 2024',
    carThumbnail: 'https://placehold.co/120x80/1e3a5f/ffffff?text=Camry', date: '2024-08-15',
    amount: 115000000, status: 'DepositPaid',
    car: { name: 'Toyota Camry 2024', thumbnail: 'https://placehold.co/120x80/1e3a5f/ffffff?text=Camry', keySpecs: '2024 | Xăng | Tự động' },
    paymentMethod: 'Chuyển khoản ngân hàng', amountPaid: 115000000, remainingBalance: 1035000000,
    dealer: { name: 'AutoMart Sài Gòn', phone: '0901234567', notes: 'Giao xe dự kiến trong 2 tuần' },
    statusTimeline: [
      { status: 'DepositPaid', timestamp: '2024-08-15T10:30:00' },
    ],
  },
  {
    id: 'order-002', orderNumber: 'AM-2024-002', carName: 'Honda CR-V 2024',
    carThumbnail: 'https://placehold.co/120x80/1a4731/ffffff?text=CR-V', date: '2024-08-10',
    amount: 110000000, status: 'Processing',
    car: { name: 'Honda CR-V 2024', thumbnail: 'https://placehold.co/120x80/1a4731/ffffff?text=CR-V', keySpecs: '2024 | Xăng | Tự động' },
    paymentMethod: 'Thẻ tín dụng', amountPaid: 110000000, remainingBalance: 990000000,
    dealer: { name: 'AutoMart Sài Gòn', phone: '0901234567', notes: 'Đang chuẩn bị xe' },
    statusTimeline: [
      { status: 'DepositPaid', timestamp: '2024-08-10T14:00:00' },
      { status: 'Processing', timestamp: '2024-08-12T09:00:00' },
    ],
  },
];

export function getOrders(): Order[] {
  return sampleOrders;
}

export function getOrderById(id: string): Order | undefined {
  return sampleOrders.find(o => o.id === id);
}

export const paymentMethods: PaymentMethod[] = [
  { id: 'bank-transfer', type: 'bank', label: 'Chuyển khoản ngân hàng', iconUrl: 'https://placehold.co/40x40/1e40af/ffffff?text=BK', enabled: true },
  { id: 'credit-card', type: 'card', label: 'Thẻ tín dụng / ghi nợ', iconUrl: 'https://placehold.co/40x40/7c3aed/ffffff?text=CC', enabled: true },
  { id: 'e-wallet', type: 'ewallet', label: 'Ví điện tử', iconUrl: 'https://placehold.co/40x40/059669/ffffff?text=EW', enabled: true },
];

export type FixtureOutcome = 'success' | 'fail';

let submitPaymentOutcome: FixtureOutcome = 'success';
export function setSubmitPaymentOutcome(o: FixtureOutcome): void { submitPaymentOutcome = o; }
export function getSubmitPaymentOutcome(): FixtureOutcome { return submitPaymentOutcome; }

let cancelOrderOutcome: FixtureOutcome = 'success';
export function setCancelOrderOutcome(o: FixtureOutcome): void { cancelOrderOutcome = o; }
export function getCancelOrderOutcome(): FixtureOutcome { return cancelOrderOutcome; }
