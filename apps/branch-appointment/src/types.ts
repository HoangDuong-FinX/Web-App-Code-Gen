// Shared TypeScript types for branch-appointment app

export interface Branch {
  id: string;
  name: string;
  address: string;
  province: string;
}

export interface TimeSlot {
  slotId: string;
  startTime: string;
  endTime: string;
  capacity: number;
  booked: number;
}

export type TransactionType = 'open-card' | 'close-account' | 'loan-consultation';

export interface Appointment {
  appointmentId: string;
  appointmentCode: string;
  branchName: string;
  branchAddress?: string;
  date: string;
  timeSlot: string;
  transactionType: string;
}

export interface BranchAppointment {
  appointmentId: string;
  appointmentCode: string;
  customerName: string;
  timeSlot: string;
  transactionType: string;
  arrived: boolean;
}

export interface BookingState {
  branchId: string;
  branchName: string;
  branchAddress: string;
  date: string;
  slotId: string;
  slotTimeRange: string;
  transactionType: TransactionType | null;
}

export type ScreenId =
  | 'branch-list'
  | 'slot-picker'
  | 'transaction-type'
  | 'confirm-booking'
  | 'booking-success'
  | 'my-appointments'
  | 'branch-day-view';
