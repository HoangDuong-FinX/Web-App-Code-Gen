import { Booking } from '../types';

let saveNoteOutcome: 'success' | 'fail' = 'success';

export function setSaveNoteOutcome(outcome: 'success' | 'fail') {
  saveNoteOutcome = outcome;
}

const BOOKINGS_DATA: Booking[] = [
  {
    id: 'booking-1',
    hotelName: 'Hilton Garden Inn',
    checkIn: '2025-03-15',
    checkOut: '2025-03-18',
    location: 'San Francisco, CA',
    note: 'Request high floor',
  },
  {
    id: 'booking-2',
    hotelName: 'The Plaza Hotel',
    checkIn: '2025-04-10',
    checkOut: '2025-04-12',
    location: 'New York, NY',
    note: '',
  },
  {
    id: 'booking-3',
    hotelName: 'Fairmont Malibu',
    checkIn: '2025-05-20',
    checkOut: '2025-05-25',
    location: 'Malibu, CA',
  },
];

export async function loadBookingsFixture(): Promise<Booking[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return BOOKINGS_DATA;
}

export async function loadBookingDetailFixture(
  bookingId: string
): Promise<Booking | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));
  return BOOKINGS_DATA.find((b) => b.id === bookingId) || null;
}

export async function saveNoteFixture(
  bookingId: string,
  note: string
): Promise<{ success: boolean; message?: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (saveNoteOutcome === 'fail') {
    return {
      success: false,
      message: 'Network error: Unable to save note',
    };
  }

  // Update the booking note in memory
  const booking = BOOKINGS_DATA.find((b) => b.id === bookingId);
  if (booking) {
    booking.note = note;
  }

  return {
    success: true,
    message: 'Note saved successfully',
  };
}
