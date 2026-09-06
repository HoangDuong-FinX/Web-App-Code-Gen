export interface Booking {
  bookingId: string;
  hotelName: string;
  dateRange: string;
  confirmationNumber: string;
}

export interface BookingDetail extends Booking {
  existingNote: string | null;
}

let saveNoteOutcomeOverride: 'success' | 'fail' | null = null;

export function setSaveNoteOutcome(outcome: 'success' | 'fail'): void {
  saveNoteOutcomeOverride = outcome;
}

export function resetSaveNoteOutcome(): void {
  saveNoteOutcomeOverride = null;
}

const BOOKINGS: Booking[] = [
  {
    bookingId: 'BK001',
    hotelName: 'Hanoi Grand Hotel',
    dateRange: 'Oct 15–18, 2024',
    confirmationNumber: 'HGH-20241015-A1B2',
  },
  {
    bookingId: 'BK002',
    hotelName: 'Saigon Plaza Resort',
    dateRange: 'Nov 1–5, 2024',
    confirmationNumber: 'SPR-20241101-C3D4',
  },
  {
    bookingId: 'BK003',
    hotelName: 'Da Nang Beachfront',
    dateRange: 'Dec 10–12, 2024',
    confirmationNumber: 'DBF-20241210-E5F6',
  },
];

const BOOKING_NOTES: Record<string, string | null> = {
  BK001: 'Late checkout requested',
  BK002: null,
  BK003: 'High floor preferred',
};

export function getBookings(): Booking[] {
  return BOOKINGS;
}

export function getBookingDetail(bookingId: string): BookingDetail {
  const booking = BOOKINGS.find((b) => b.bookingId === bookingId);
  if (!booking) {
    throw new Error(`Booking ${bookingId} not found`);
  }
  return {
    ...booking,
    existingNote: BOOKING_NOTES[bookingId] || null,
  };
}

export async function saveNote(
  bookingId: string,
  noteText: string
): Promise<{ success: boolean; message?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (saveNoteOutcomeOverride === 'fail') {
    return { success: false, message: 'Simulated save failure' };
  }

  BOOKING_NOTES[bookingId] = noteText;
  return { success: true, message: 'Note saved' };
}