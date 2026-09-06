export interface Booking {
  bookingId: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  location: string;
  noteText?: string;
}