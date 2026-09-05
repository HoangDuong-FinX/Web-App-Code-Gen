export interface Booking {
  bookingId: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  location: string;
  roomInfo: string;
  confirmationNumber: string;
}

export const bookingsFixture: Booking[] = [
  {
    bookingId: 'BK001',
    hotelName: 'Luxury Plaza Hotel',
    checkInDate: '2025-03-15',
    checkOutDate: '2025-03-18',
    location: 'San Francisco, CA',
    roomInfo: 'Deluxe Room, King Bed',
    confirmationNumber: 'LPH-2025-001',
  },
  {
    bookingId: 'BK002',
    hotelName: 'Beachside Resort',
    checkInDate: '2025-04-10',
    checkOutDate: '2025-04-15',
    location: 'Maui, HI',
    roomInfo: 'Ocean View Suite',
    confirmationNumber: 'BSR-2025-002',
  },
  {
    bookingId: 'BK003',
    hotelName: 'Downtown Boutique',
    checkInDate: '2025-05-01',
    checkOutDate: '2025-05-03',
    location: 'New York, NY',
    roomInfo: 'Standard Room, Queen Bed',
    confirmationNumber: 'DWB-2025-003',
  },
];
