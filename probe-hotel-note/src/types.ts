export interface Booking {
  id: string;
  hotelName: string;
  checkIn: string; // ISO 8601 date
  checkOut: string; // ISO 8601 date
  location: string;
  note?: string;
}
