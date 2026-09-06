import type { Booking } from '../types';

const mockBookings: Booking[] = [
  {
    id: 'booking-001',
    hotelName: 'Grand Plaza Hotel',
    checkInDate: '2025-03-15',
    checkOutDate: '2025-03-18',
    bookingStatus: 'Confirmed',
    bookingReference: 'GP-2025-001',
    noteText: 'Early check-in requested',
  },
  {
    id: 'booking-002',
    hotelName: 'Seaside Resort',
    checkInDate: '2025-04-10',
    checkOutDate: '2025-04-14',
    bookingStatus: 'Confirmed',
    bookingReference: 'SR-2025-042',
    noteText: null,
  },
  {
    id: 'booking-003',
    hotelName: 'Mountain View Inn',
    checkInDate: '2025-05-01',
    checkOutDate: '2025-05-05',
    bookingStatus: 'Pending',
    bookingReference: 'MV-2025-156',
    noteText: null,
  },
];

let saveOutcome: 'success' | 'fail' = 'success';

export function setSaveOutcome(outcome: 'success' | 'fail') {
  saveOutcome = outcome;
}

export async function loadBookings(): Promise<Booking[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockBookings);
    }, 300);
  });
}

export async function loadBookingDetail(bookingId: string): Promise<Booking> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booking = mockBookings.find((b) => b.id === bookingId);
      if (booking) {
        resolve(booking);
      } else {
        reject(new Error('Booking not found'));
      }
    }, 300);
  });
}

export async function saveNote(
  bookingId: string,
  noteText: string
): Promise<{ success: boolean; message?: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (saveOutcome === 'fail') {
        resolve({
          success: false,
          message: 'Server error. Please try again later.',
        });
      } else {
        const booking = mockBookings.find((b) => b.id === bookingId);
        if (booking) {
          booking.noteText = noteText;
        }
        resolve({ success: true });
      }
    }, 500);
  });
}