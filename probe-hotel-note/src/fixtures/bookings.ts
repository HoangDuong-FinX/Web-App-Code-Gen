// Fixture module for all three bindings: load-bookings, load-booking-detail, save-note
// All are fixtures with deterministic failure control

import { Booking } from '../App';

// Fixture control: set outcome to 'fail' to trigger error paths
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

// Fixture data
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

// Binding: load-bookings
// Trigger: screen entry (bookings-list loaded)
// Returns: array of bookings
export async function loadBookings(): Promise<Booking[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (bookingsOutcome === 'fail') {
    throw new Error('Failed to load bookings');
  }

  return fixtureBookings;
}

// Binding: load-booking-detail
// Trigger: user selects a booking (select-booking action)
// Sends: bookingId
// Returns: single booking detail
export async function loadBookingDetail(bookingId: string): Promise<Booking> {
  // Simulate network delay
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

// Binding: save-note
// Trigger: user presses 'Save Note' or 'Retry' button
// Sends: bookingId, note
// Returns: success response
export async function saveNote(bookingId: string, note: string): Promise<{ success: true; bookingId: string; note: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (saveNoteOutcome === 'fail') {
    throw new Error('Failed to save note');
  }

  // Update fixture data to reflect saved note
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
