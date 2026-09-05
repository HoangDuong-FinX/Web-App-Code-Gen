export interface Booking {
  bookingId: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  location: string;
  roomInfo: string;
  confirmationNumber: string;
}

const FIXTURE_BOOKINGS: Booking[] = [
  {
    bookingId: 'bk-001',
    hotelName: 'Grand Plaza Hotel',
    checkInDate: '2025-03-15',
    checkOutDate: '2025-03-18',
    location: 'New York, NY',
    roomInfo: 'Suite 2501 (2 beds, 1 bath)',
    confirmationNumber: 'GPH-2025-98765',
  },
  {
    bookingId: 'bk-002',
    hotelName: 'Seaside Resort',
    checkInDate: '2025-04-10',
    checkOutDate: '2025-04-14',
    location: 'Miami Beach, FL',
    roomInfo: 'Ocean View Room (1 bed, 1 bath)',
    confirmationNumber: 'SSR-2025-54321',
  },
  {
    bookingId: 'bk-003',
    hotelName: 'Mountain Lodge',
    checkInDate: '2025-05-22',
    checkOutDate: '2025-05-25',
    location: 'Denver, CO',
    roomInfo: 'Deluxe Room (1 bed, 1 bath)',
    confirmationNumber: 'ML-2025-11111',
  },
];

export function loadBookings(): Booking[] {
  return FIXTURE_BOOKINGS;
}

export function loadBookingDetail(bookingId: string): Booking | null {
  return FIXTURE_BOOKINGS.find(b => b.bookingId === bookingId) || null;
}