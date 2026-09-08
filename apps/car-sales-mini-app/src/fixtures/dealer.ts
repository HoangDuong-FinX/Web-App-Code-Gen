import type { TimeSlot, DealerLocation } from '../types';

export const dealerDashboardData = {
  inventoryCount: 24,
  activeLeadsCount: 12,
  recentOrders: [
    { carName: 'Toyota Camry 2024', buyerName: 'Nguyễn Văn A', status: 'DepositPaid' as const, date: '2024-08-15' },
    { carName: 'Honda CR-V 2024', buyerName: 'Trần Thị B', status: 'Processing' as const, date: '2024-08-10' },
    { carName: 'Mazda CX-5 2024', buyerName: 'Lê Văn C', status: 'Delivered' as const, date: '2024-08-05' },
  ],
};

export const testDriveSlots: TimeSlot[] = [
  { slotId: 'slot-1', startTime: '09:00', endTime: '10:00', available: true },
  { slotId: 'slot-2', startTime: '10:00', endTime: '11:00', available: true },
  { slotId: 'slot-3', startTime: '11:00', endTime: '12:00', available: false },
  { slotId: 'slot-4', startTime: '14:00', endTime: '15:00', available: true },
  { slotId: 'slot-5', startTime: '15:00', endTime: '16:00', available: true },
];

export const dealerLocations: DealerLocation[] = [
  { locationId: 'loc-1', name: 'AutoMart Quận 7', address: '123 Nguyễn Văn Linh, Q.7, TP.HCM' },
  { locationId: 'loc-2', name: 'AutoMart Thủ Đức', address: '456 Xa lộ Hà Nội, TP. Thủ Đức' },
];

export const dealerLeadsData = {
  testDriveLeads: [
    { buyerName: 'Nguyễn Văn A', carName: 'Toyota Camry 2024', requestedDate: '2024-08-20', status: 'Chờ xác nhận' },
    { buyerName: 'Phạm Thị D', carName: 'Mazda CX-5 2024', requestedDate: '2024-08-22', status: 'Đã xác nhận' },
  ],
  inquiryLeads: [
    { buyerName: 'Trần Văn E', carName: 'Mercedes C300 AMG 2023', messagePreview: 'Xe còn bảo hành không?', date: '2024-08-18' },
  ],
  orderLeads: [
    { buyerName: 'Nguyễn Văn A', carName: 'Toyota Camry 2024', amount: 1150000000, status: 'DepositPaid' as const },
  ],
};

export type FixtureOutcome = 'success' | 'fail';

let submitTestDriveOutcome: FixtureOutcome = 'success';
export function setSubmitTestDriveOutcome(o: FixtureOutcome): void { submitTestDriveOutcome = o; }
export function getSubmitTestDriveOutcome(): FixtureOutcome { return submitTestDriveOutcome; }

let submitCarListingOutcome: FixtureOutcome = 'success';
export function setSubmitCarListingOutcome(o: FixtureOutcome): void { submitCarListingOutcome = o; }
export function getSubmitCarListingOutcome(): FixtureOutcome { return submitCarListingOutcome; }

let removeCarListingOutcome: FixtureOutcome = 'success';
export function setRemoveCarListingOutcome(o: FixtureOutcome): void { removeCarListingOutcome = o; }
export function getRemoveCarListingOutcome(): FixtureOutcome { return removeCarListingOutcome; }
