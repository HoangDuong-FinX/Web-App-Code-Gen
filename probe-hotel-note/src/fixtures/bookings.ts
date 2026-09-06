import { Booking } from '../types';

// Fixture state for testing failure paths
let saveNoteOutcome: 'success' | 'fail' = 'success';

export function setSaveNoteOutcome(outcome: 'success' | 'fail') {
  saveNoteOutcome = outcome;
}

export async function loadBookingsFixture(): Promise<Booking[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return [
    {
      id: 'booking-1',
      hotelName: 'Grand Plaza Hotel',
      checkInDate: '2025-03-15',
      checkOutDate: '2025-03-18',
      bookingStatus: 'Confirmed',
      bookingReference: 'BP-001-2025',
      noteText: null,
    },
    {
      id: 'booking-2',
      hotelName: 'Seaside Resort',
      checkInDate: '2025-04-20',
      checkOutDate: '2025-04-25',
      bookingStatus: 'Confirmed',
      bookingReference: 'SR-002-2025',
      noteText: 'Near the beach, great views',
    },
    {
      id: 'booking-3',
      hotelName: 'Mountain Lodge',
      checkInDate: '2025-05-10',
      checkOutDate: '2025-05-12',
      bookingStatus: 'Pending',
      bookingReference: 'ML-003-2025',
      noteText: null,
    },
  ];
}

export async function loadBookingDetailFixture(bookingId: string): Promise<Booking> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const allBookings = await loadBookingsFixture();
  const booking = allBookings.find((b) => b.id === bookingId);

  if (!booking) {
    throw new Error(`Booking ${bookingId} not found`);
  }

  return booking;
}

export async function saveNoteFixture(
  bookingId: string,
  noteText: string
): Promise<{ success: boolean; message?: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (saveNoteOutcome === 'fail') {
    return { success: false, message: 'Failed to save note. Please try again.' };
  }

  // Success case: return success response
  return { success: true, message: 'Note saved successfully' };
}
