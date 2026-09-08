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
  { id: 'inq-1', type: 'inquiry', carId: 'car-1', carName: 'Toyota Camry 2024', statusLabel: '\u0110ang ch\u1edd', statusVariant: 'warning', date: '15/01/2024' },
  { id: 'inq-2', type: 'inquiry', carId: 'car-3', carName: 'Mazda CX-5 2024', statusLabel: '\u0110\u00e3 li\u00ean h\u1ec7', statusVariant: 'success', date: '10/01/2024' },
];

const sampleTestDrives: ActivityItem[] = [
  { id: 'td-1', type: 'test-drive', carId: 'car-2', carName: 'Honda CR-V 2024', statusLabel: '\u0110\u00e3 x\u00e1c nh\u1eadn', statusVariant: 'success', date: '20/01/2024 10:00', showroomName: 'Showroom Th\u1ee7 \u0110\u1ee9c' },
];

const sampleReservations: ActivityItem[] = [
  { id: 'res-1', type: 'reservation', carId: 'car-5', carName: 'VinFast VF 8 2024', statusLabel: '\u0110ang gi\u1eef xe', statusVariant: 'success', date: '18/01/2024', depositAmount: '50.000.000 \u20ab' },
];

const sampleActivityDetail: ActivityDetail = {
  car: { name: 'Toyota Camry 2024', thumbnailUrl: 'https://placehold.co/400x300/e2e8f0/475569?text=Camry', formattedPrice: '1.050.000.000 \u20ab', id: 'car-1' },
  activity: { statusLabel: '\u0110ang ch\u1edd', statusVariant: 'warning', typeSpecificDetails: 'Ph\u01b0\u01a1ng th\u1ee9c: G\u1ecdi \u0111i\u1ec7n\nTh\u1eddi gian: S\u00e1ng th\u1ee9 2 - th\u1ee9 6' },
  timeline: [
    { date: '15/01/2024', description: 'G\u1eedi y\u00eau c\u1ea7u t\u01b0 v\u1ea5n' },
    { date: '15/01/2024', description: 'H\u1ec7 th\u1ed1ng ti\u1ebfp nh\u1eadn' },
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
