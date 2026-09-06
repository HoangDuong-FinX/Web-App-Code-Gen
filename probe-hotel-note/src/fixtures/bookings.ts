import { Booking } from '../types';

let saveNoteOutcome: 'success' | 'fail' = 'success';

export function setSaveNoteOutcome(outcome: 'success' | 'fail') {
  saveNoteOutcome = outcome;
}

const FIXTURE_BOOKINGS: Booking[] = [
  {
    id: 'booking-1',
    hotelName: 'The Grand Hotel',
    checkInDate: '2025-03-15',
    checkOutDate: '2025-03-18',
    status: 'confirmed',
    statusVariant: 'success',
    location: 'New York, NY',
    confirmationNumber: 'GH-2025-001',
    note: 'High floor with city view preferred',
  },
  {
    id: 'booking-2',
    hotelName: 'Seaside Resort',
    checkInDate: '2025-04-10',
    checkOutDate: '2025-04-15',
    status: 'pending',
    statusVariant: 'warning',
    location: 'Miami, FL',
    confirmationNumber: 'SR-2025-042',
    note: '',
  },
  {
    id: 'booking-3',
    hotelName: 'Mountain Lodge',
    checkInDate: '2025-02-01',
    checkOutDate: '2025-02-05',
    status: 'completed',
    statusVariant: 'default',
    location: 'Denver, CO',
    confirmationNumber: 'ML-2024-156',
    note: 'Great experience, quiet and peaceful',
  },
];

export function loadBookings(): Booking[] {
  return FIXTURE_BOOKINGS;
}

export function loadBookingDetail(bookingId: string): Booking {
  const booking = FIXTURE_BOOKINGS.find((b) => b.id === bookingId);
  if (!booking) {
    throw new Error(`Booking not found: ${bookingId}`);
  }
  return booking;
}

export async function saveBookingNote(
  bookingId: string,
  note: string
): Promise<{ success: boolean; message?: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (saveNoteOutcome === 'success') {
        resolve({ success: true, message: 'Note saved successfully' });
      } else {
        resolve({ success: false, message: 'Failed to save note' });
      }
    }, 800);
  });
}