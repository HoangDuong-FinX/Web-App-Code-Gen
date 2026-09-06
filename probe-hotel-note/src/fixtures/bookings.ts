// Fixture for load-bookings-list binding
// All three bindings are fixtures; this module provides deterministic control over success/failure

export interface Booking {
  id: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  bookingStatus: string;
  bookingReference: string;
  noteText: string | null;
}

let bookingsLoadOutcome: 'success' | 'fail' = 'success';

export function setBookingsLoadOutcome(outcome: 'success' | 'fail') {
  bookingsLoadOutcome = outcome;
}

export function resetBookingsLoadOutcome() {
  bookingsLoadOutcome = 'success';
}

export async function loadBookingsList(): Promise<Booking[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (bookingsLoadOutcome === 'fail') {
        reject(new Error('Failed to load bookings'));
      } else {
        resolve([
          {
            id: 'booking-1',
            hotelName: 'Grand Hotel Downtown',
            checkInDate: '2024-09-15',
            checkOutDate: '2024-09-18',
            bookingStatus: 'Confirmed',
            bookingReference: 'GHD-2024-001',
            noteText: 'Early check-in requested',
          },
          {
            id: 'booking-2',
            hotelName: 'Beachside Resort',
            checkInDate: '2024-10-01',
            checkOutDate: '2024-10-07',
            bookingStatus: 'Confirmed',
            bookingReference: 'BSR-2024-002',
            noteText: null,
          },
          {
            id: 'booking-3',
            hotelName: 'Mountain Lodge',
            checkInDate: '2024-11-10',
            checkOutDate: '2024-11-12',
            bookingStatus: 'Pending',
            bookingReference: 'ML-2024-003',
            noteText: null,
          },
        ]);
      }
    }, 100);
  });
}
