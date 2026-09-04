// Fixture data for branch-day-view (staff screen)
// Waiting on: BRD FR-8 staff endpoints not defined in section 9

import type { BranchAppointment } from '../types';

export const fixtureBranchName = 'Chi nh\u00e1nh Qu\u1eadn 1';

export const fixtureBranchAppointments: BranchAppointment[] = [
  {
    appointmentId: 'apt-f001',
    appointmentCode: 'HN-001',
    customerName: 'Nguy\u1ec5n V\u0103n A',
    timeSlot: '08:00 - 08:30',
    transactionType: 'M\u1edf th\u1ebb',
    arrived: true,
  },
  {
    appointmentId: 'apt-f002',
    appointmentCode: 'HN-002',
    customerName: 'Tr\u1ea7n Th\u1ecb B',
    timeSlot: '08:30 - 09:00',
    transactionType: 'T\u1ea5t to\u00e1n',
    arrived: false,
  },
  {
    appointmentId: 'apt-f003',
    appointmentCode: 'HN-003',
    customerName: 'L\u00ea V\u0103n C',
    timeSlot: '09:00 - 09:30',
    transactionType: 'T\u01b0 v\u1ea5n kho\u1ea3n vay',
    arrived: false,
  },
  {
    appointmentId: 'apt-f004',
    appointmentCode: 'HN-004',
    customerName: 'Ph\u1ea1m Th\u1ecb D',
    timeSlot: '10:00 - 10:30',
    transactionType: 'M\u1edf th\u1ebb',
    arrived: false,
  },
];
