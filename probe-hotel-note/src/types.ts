// types.ts
export interface Booking {
  referenceId: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  noteText?: string;
}

export type ScreenId = 'bookings-list' | 'booking-detail' | 'booking-detail-save-failed';

export interface AppState {
  currentScreen: ScreenId;
  bookings: Booking[];
  selectedBooking: Booking | null;
  noteText: string;
  isLoading: boolean;
  loadError: string | null;
}
