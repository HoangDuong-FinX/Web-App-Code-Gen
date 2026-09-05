import type { Booking } from '../types/index';

export const bookingsFixture: Booking[] = [
  {
    bookingId: 'booking-001',
    hotelName: 'Grand Plaza Hotel',
    checkIn: '2026-09-15',
    checkOut: '2026-09-18',
    confirmationNumber: '12345',
  },
  {
    bookingId: 'booking-002',
    hotelName: 'Riverside Resort',
    checkIn: '2026-10-01',
    checkOut: '2026-10-05',
    confirmationNumber: '67890',
  },
  {
    bookingId: 'booking-003',
    hotelName: 'Mountain View Inn',
    checkIn: '2026-11-10',
    checkOut: '2026-11-12',
    confirmationNumber: 'ABC123',
  },
];
