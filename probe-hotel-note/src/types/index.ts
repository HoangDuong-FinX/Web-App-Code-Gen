export interface Booking {
  bookingId: string;
  hotelName: string;
  checkIn: string; // ISO 8601 date
  checkOut: string; // ISO 8601 date
  confirmationNumber: string;
}

export type ScreenId = 'bookings-list' | 'booking-detail' | 'booking-detail-save-failed';

export interface NavigationState {
  currentScreen: ScreenId;
  selectedBookingId?: string;
  noteText?: string;
}
