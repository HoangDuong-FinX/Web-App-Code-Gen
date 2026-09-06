let saveNoteOutcomeOverride: 'success' | 'fail' | null = null;

export function setSaveNoteOutcome(outcome: 'success' | 'fail' | null) {
  saveNoteOutcomeOverride = outcome;
}

const FIXTURE_BOOKINGS = [
  {
    bookingId: 'BK001',
    hotelName: 'Grand Plaza Hotel',
    checkInDate: '2024-12-20',
    checkOutDate: '2024-12-23',
    location: 'New York, NY',
    noteText: '',
  },
  {
    bookingId: 'BK002',
    hotelName: 'Sunset Beach Resort',
    checkInDate: '2025-01-10',
    checkOutDate: '2025-01-15',
    location: 'Miami, FL',
    noteText: 'Request late checkout',
  },
  {
    bookingId: 'BK003',
    hotelName: 'Mountain View Inn',
    checkInDate: '2025-02-01',
    checkOutDate: '2025-02-05',
    location: 'Denver, CO',
    noteText: '',
  },
];

export async function loadBookings() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return FIXTURE_BOOKINGS;
}

export async function loadBookingDetail(bookingId: string) {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const booking = FIXTURE_BOOKINGS.find((b) => b.bookingId === bookingId);
  if (!booking) {
    throw new Error('Booking not found');
  }
  return booking;
}

export async function saveNote(bookingId: string, noteText: string) {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (saveNoteOutcomeOverride === 'fail') {
    return { success: false, message: 'Save failed' };
  }

  return { success: true, message: 'Note saved' };
}