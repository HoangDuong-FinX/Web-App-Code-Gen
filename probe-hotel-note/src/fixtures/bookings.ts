export interface Booking {
  id: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  bookingStatus: string;
  bookingReference: string;
  noteText: string | null;
}

export interface SaveNoteResult {
  success: boolean;
  message?: string;
}

// Fixture state for deterministic testing
let saveNoteOutcome: 'success' | 'fail' = 'success';

export function setSaveNoteOutcome(outcome: 'success' | 'fail') {
  saveNoteOutcome = outcome;
}

// Fixture: load bookings list
export function loadBookings(): Booking[] {
  return [
    {
      id: 'booking-001',
      hotelName: 'Grand Hotel Downtown',
      checkInDate: '2026-09-15',
      checkOutDate: '2026-09-18',
      bookingStatus: 'Confirmed',
      bookingReference: 'GHD-2026-001',
      noteText: null,
    },
    {
      id: 'booking-002',
      hotelName: 'Seaside Resort',
      checkInDate: '2026-10-05',
      checkOutDate: '2026-10-12',
      bookingStatus: 'Confirmed',
      bookingReference: 'SR-2026-042',
      noteText: 'Request high floor with ocean view',
    },
    {
      id: 'booking-003',
      hotelName: 'Mountain Retreat',
      checkInDate: '2026-11-01',
      checkOutDate: '2026-11-03',
      bookingStatus: 'Pending',
      bookingReference: 'MR-2026-015',
      noteText: null,
    },
  ];
}

// Fixture: load booking detail
export function loadBookingDetail(bookingId: string): Booking {
  const bookings = loadBookings();
  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking) {
    throw new Error(`Booking ${bookingId} not found`);
  }
  return booking;
}

// Fixture: save note with deterministic outcome
export async function saveNote(
  _bookingId: string,
  _noteText: string
): Promise<SaveNoteResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (saveNoteOutcome === 'fail') {
    return {
      success: false,
      message: 'Failed to save note. Please try again.',
    };
  }

  return {
    success: true,
    message: 'Note saved successfully',
  };
}
