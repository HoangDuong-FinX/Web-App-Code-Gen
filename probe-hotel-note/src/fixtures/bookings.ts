import type { Booking } from '../types';

let bookingsFixture: Booking[] = [
  {
    bookingId: 'BK001',
    hotelName: 'Grand Hotel Hanoi',
    checkInDate: '2025-09-15',
    checkOutDate: '2025-09-18',
    status: 'confirmed',
    note: 'High floor preferred',
  },
  {
    bookingId: 'BK002',
    hotelName: 'Beachfront Resort',
    checkInDate: '2025-10-01',
    checkOutDate: '2025-10-05',
    status: 'pending',
    note: '',
  },
  {
    bookingId: 'BK003',
    hotelName: 'City Center Inn',
    checkInDate: '2025-11-20',
    checkOutDate: '2025-11-22',
    status: 'confirmed',
    note: '',
  },
];

export async function loadBookingsList(): Promise<Booking[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(bookingsFixture);
    }, 200);
  });
}

export function setBookingsFixture(bookings: Booking[]): void {
  bookingsFixture = bookings;
}

export function resetBookingsFixture(): void {
  bookingsFixture = [
    {
      bookingId: 'BK001',
      hotelName: 'Grand Hotel Hanoi',
      checkInDate: '2025-09-15',
      checkOutDate: '2025-09-18',
      status: 'confirmed',
      note: 'High floor preferred',
    },
    {
      bookingId: 'BK002',
      hotelName: 'Beachfront Resort',
      checkInDate: '2025-10-01',
      checkOutDate: '2025-10-05',
      status: 'pending',
      note: '',
    },
    {
      bookingId: 'BK003',
      hotelName: 'City Center Inn',
      checkInDate: '2025-11-20',
      checkOutDate: '2025-11-22',
      status: 'confirmed',
      note: '',
    },
  ];
}
