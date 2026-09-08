import type { ActivityItem, ActivityDetail } from '../types';

let myInquiriesOutcome: 'success' | 'fail' = 'success';
export function setMyInquiriesOutcome(v: 'success' | 'fail'): void { myInquiriesOutcome = v; }

let myTestDrivesOutcome: 'success' | 'fail' = 'success';
export function setMyTestDrivesOutcome(v: 'success' | 'fail'): void { myTestDrivesOutcome = v; }

let myReservationsOutcome: 'success' | 'fail' = 'success';
export function setMyReservationsOutcome(v: 'success' | 'fail'): void { myReservationsOutcome = v; }

let activityDetailOutcome: 'success' | 'fail' = 'success';
export function setActivityDetailOutcome(v: 'success' | 'fail'): void { activityDetailOutcome = v; }

const sampleInquiries: ActivityItem[] = [
  { id: 'inq-1', type: 'inquiry', carId: 'car-1', carName: 'Toyota Camry 2024', statusLabel: 'Đang chờ', statusVariant: 'warning', date: '15/01/2024' },
  { id: 'inq-2', type: 'inquiry', carId: 'car-3', carName: 'Mazda CX-5 2024', statusLabel: 'Đã liên hệ', statusVariant: 'success', date: '10/01/2024' },
];

const sampleTestDrives: ActivityItem[] = [
  { id: 'td-1', type: 'test-drive', carId: 'car-2', carName: 'Honda CR-V 2024', statusLabel: 'Đã xác nhận', statusVariant: 'success', date: '20/01/2024 10:00', showroomName: 'Showroom Thủ Đức' },
];

const sampleReservations: ActivityItem[] = [
  { id: 'res-1', type: 'reservation', carId: 'car-5', carName: 'VinFast VF 8 2024', statusLabel: 'Đang giữ xe', statusVariant: 'success', date: '18/01/2024', depositAmount: '50.000.000 ₫' },
];

const sampleActivityDetail: ActivityDetail = {
  car: { name: 'Toyota Camry 2024', thumbnailUrl: 'https://placehold.co/400x300/e2e8f0/475569?text=Camry', formattedPrice: '1.050.000.000 ₫', id: 'car-1' },
  activity: { statusLabel: 'Đang chờ', statusVariant: 'warning', typeSpecificDetails: 'Phương thức: Gọi điện\nThời gian: Sáng thứ 2 - thứ 6' },
  timeline: [
    { date: '15/01/2024', description: 'Gửi yêu cầu tư vấn' },
    { date: '15/01/2024', description: 'Hệ thống tiếp nhận' },
  ],
};

export async function loadMyInquiries(): Promise<ActivityItem[]> {
  await new Promise(r => setTimeout(r, 300));
  if (myInquiriesOutcome === 'fail') throw new Error('Network error');
  return sampleInquiries;
}

export async function loadMyTestDrives(): Promise<ActivityItem[]> {
  await new Promise(r => setTimeout(r, 300));
  if (myTestDrivesOutcome === 'fail') throw new Error('Network error');
  return sampleTestDrives;
}

export async function loadMyReservations(): Promise<ActivityItem[]> {
  await new Promise(r => setTimeout(r, 300));
  if (myReservationsOutcome === 'fail') throw new Error('Network error');
  return sampleReservations;
}

export async function loadActivityDetail(): Promise<ActivityDetail> {
  await new Promise(r => setTimeout(r, 200));
  if (activityDetailOutcome === 'fail') throw new Error('Network error');
  return sampleActivityDetail;
}
