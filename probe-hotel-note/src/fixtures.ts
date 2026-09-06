// fixtures.ts
export interface Booking {
  referenceId: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  noteText?: string;
}

const mockBookings: Booking[] = [
  {
    referenceId: 'BK001',
    hotelName: 'Grand Plaza Hotel',
    checkInDate: '2026-09-10',
    checkOutDate: '2026-09-15',
    noteText: '',
  },
  {
    referenceId: 'BK002',
    hotelName: 'Seaside Resort',
    checkInDate: '2026-10-01',
    checkOutDate: '2026-10-07',
    noteText: '',
  },
  {
    referenceId: 'BK003',
    hotelName: 'Mountain View Inn',
    checkInDate: '2026-11-15',
    checkOutDate: '2026-11-18',
    noteText: 'Early check-in requested',
  },
];

let loadBookingsOutcome: 'success' | 'fail' = 'success';
let saveNoteOutcome: 'success' | 'fail' = 'success';

export function setLoadBookingsOutcome(outcome: 'success' | 'fail'): void {
  loadBookingsOutcome = outcome;
}

export function setSaveNoteOutcome(outcome: 'success' | 'fail'): void {
  saveNoteOutcome = outcome;
}

export async function loadBookings(): Promise<Booking[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (loadBookingsOutcome === 'fail') {
    throw new Error('Failed to load bookings');
  }
  return mockBookings;
}

export async function saveNote(
  referenceId: string,
  noteText: string
): Promise<{ success: boolean; message?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (saveNoteOutcome === 'fail') {
    throw new Error('Failed to save note');
  }
  // Update mock booking
  const booking = mockBookings.find((b) => b.referenceId === referenceId);
  if (booking) {
    booking.noteText = noteText;
  }
  return { success: true, message: 'Note saved successfully' };
}
