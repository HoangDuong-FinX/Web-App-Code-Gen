import type { Booking } from '../App';

let bookingsOutcome: 'success' | 'fail' = 'success';
let bookingDetailOutcome: 'success' | 'fail' = 'success';
let saveNoteOutcome: 'success' | 'fail' = 'success';

export function setBookingsOutcome(outcome: 'success' | 'fail') {
  bookingsOutcome = outcome;
}

export function setBookingDetailOutcome(outcome: 'success' | 'fail') {
  bookingDetailOutcome = outcome;
}

export function setSaveNoteOutcome(outcome: 'success' | 'fail') {
  saveNoteOutcome = outcome;
}

const fixtureBookings: Booking[] = [
  {
    bookingId: 'bk-001',
    hotelName: 'Grand Hotel Hanoi',
    checkInDate: '2026-09-10',
    checkOutDate: '2026-09-13',
    roomType: 'Deluxe Room',
    note: 'Remember to ask for late checkout',
  },
  {
    bookingId: 'bk-002',
    hotelName: 'Beachside Resort',
    checkInDate: '2026-10-01',
    checkOutDate: '2026-10-05',
    roomType: 'Suite with Ocean View',
    note: null,
  },
  {
    bookingId: 'bk-003',
    hotelName: 'Mountain Lodge',
    checkInDate: '2026-11-15',
    checkOutDate: '2026-11-18',
    roomType: 'Standard Room',
    note: 'Hiking trip - bring boots',
  },
];

const fixtureBookingDetails: Record<string, Booking> = {
  'bk-001': {
    bookingId: 'bk-001',
    hotelName: 'Grand Hotel Hanoi',
    checkInDate: '2026-09-10',
    checkOutDate: '2026-09-13',
    roomType: 'Deluxe Room',
    note: 'Remember to ask for late checkout',
  },
  'bk-002': {
    bookingId: 'bk-002',
    hotelName: 'Beachside Resort',
    checkInDate: '2026-10-01',
    checkOutDate: '2026-10-05',
    roomType: 'Suite with Ocean View',
    note: null,
  },
  'bk-003': {
    bookingId: 'bk-003',
    hotelName: 'Mountain Lodge',
    checkInDate: '2026-11-15',
    checkOutDate: '2026-11-18',
    roomType: 'Standard Room',
    note: 'Hiking trip - bring boots',
  },
};

export async function loadBookings(): Promise<Booking[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (bookingsOutcome === 'fail') {
    throw new Error('Failed to load bookings');
  }

  return fixtureBookings;
}

export async function loadBookingDetail(bookingId: string): Promise<Booking> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (bookingDetailOutcome === 'fail') {
    throw new Error('Failed to load booking detail');
  }

  const booking = fixtureBookingDetails[bookingId];
  if (!booking) {
    throw new Error(`Booking ${bookingId} not found`);
  }

  return booking;
}

export async function saveNote(bookingId: string, note: string): Promise<{ success: true; bookingId: string; note: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (saveNoteOutcome === 'fail') {
    throw new Error('Failed to save note');
  }

  if (fixtureBookingDetails[bookingId]) {
    fixtureBookingDetails[bookingId].note = note;
  }
  const bookingIndex = fixtureBookings.findIndex((b) => b.bookingId === bookingId);
  if (bookingIndex !== -1) {
    fixtureBookings[bookingIndex].note = note;
  }

  return {
    success: true,
    bookingId,
    note,
  };
}
