export interface Booking {
  id: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  bookingStatus: string;
  bookingReference: string;
  noteText: string | null;
}
