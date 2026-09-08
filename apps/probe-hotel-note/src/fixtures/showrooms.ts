import type { Showroom, TimeSlot } from '../types';

let showroomOutcome: 'success' | 'fail' = 'success';
export function setShowroomOutcome(v: 'success' | 'fail'): void { showroomOutcome = v; }

let timeSlotsOutcome: 'success' | 'fail' = 'success';
export function setTimeSlotsOutcome(v: 'success' | 'fail'): void { timeSlotsOutcome = v; }

const sampleShowrooms: Showroom[] = [
  { id: 'sr-1', name: 'Showroom Th\u1ee7 \u0110\u1ee9c', address: '123 V\u00f5 V\u0103n Ng\u00e2n, Th\u1ee7 \u0110\u1ee9c, TP.HCM', distance: '3.2 km', hours: '8:00 - 18:00' },
  { id: 'sr-2', name: 'Showroom Qu\u1eadn 7', address: '456 Nguy\u1ec5n Th\u1ecb Th\u1eadp, Qu\u1eadn 7, TP.HCM', distance: '7.5 km', hours: '8:00 - 19:00' },
  { id: 'sr-3', name: 'Showroom B\u00ecnh T\u00e2n', address: '789 Kinh D\u01b0\u01a1ng V\u01b0\u01a1ng, B\u00ecnh T\u00e2n, TP.HCM', distance: '12.1 km', hours: '8:30 - 18:30' },
];

const sampleTimeSlots: TimeSlot[] = [
  { time: '08:00', isUnavailable: false },
  { time: '09:00', isUnavailable: false },
  { time: '10:00', isUnavailable: true },
  { time: '11:00', isUnavailable: false },
  { time: '13:00', isUnavailable: false },
  { time: '14:00', isUnavailable: false },
  { time: '15:00', isUnavailable: true },
  { time: '16:00', isUnavailable: false },
];

export async function loadShowrooms(): Promise<Showroom[]> {
  await new Promise(r => setTimeout(r, 300));
  if (showroomOutcome === 'fail') throw new Error('Network error');
  return sampleShowrooms;
}

export async function loadTimeSlots(): Promise<TimeSlot[]> {
  await new Promise(r => setTimeout(r, 200));
  if (timeSlotsOutcome === 'fail') throw new Error('Network error');
  return sampleTimeSlots;
}

export { sampleShowrooms };
