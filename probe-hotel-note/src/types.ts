export interface Booking {
  bookingId: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  guestCount: number;
  note: string;
}