import { useState } from 'react';

export interface Booking {
  id: string;
  hotelName: string;
  bookingDatesStart: string;
  bookingDatesEnd: string;
  bookingStatus: string;
  bookingReference: string;
}

const FIXTURE_BOOKINGS: Booking[] = [
  {
    id: 'bk001',
    hotelName: 'Grand Plaza Hotel',
    bookingDatesStart: '2025-06-15',
    bookingDatesEnd: '2025-06-18',
    bookingStatus: 'Confirmed',
    bookingReference: 'GPH-2025-06-001',
  },
  {
    id: 'bk002',
    hotelName: 'Seaside Resort',
    bookingDatesStart: '2025-07-01',
    bookingDatesEnd: '2025-07-08',
    bookingStatus: 'Confirmed',
    bookingReference: 'SRS-2025-07-002',
  },
  {
    id: 'bk003',
    hotelName: 'Mountain View Inn',
    bookingDatesStart: '2025-08-20',
    bookingDatesEnd: '2025-08-22',
    bookingStatus: 'Pending',
    bookingReference: 'MVI-2025-08-003',
  },
];

let saveNoteOutcome: 'success' | 'fail' = 'success';

export function setSaveNoteOutcome(outcome: 'success' | 'fail'): void {
  saveNoteOutcome = outcome;
}

export function useLoadBookings(): { bookings: Booking[]; loading: boolean } {
  const [bookings] = useState<Booking[]>(FIXTURE_BOOKINGS);
  return { bookings, loading: false };
}

export async function saveNote(
  bookingId: string,
  noteText: string
): Promise<{ success: boolean; message: string }> {
  // Simulate async operation
  return new Promise((resolve) => {
    setTimeout(() => {
      if (saveNoteOutcome === 'success') {
        resolve({ success: true, message: 'Note saved successfully' });
      } else {
        resolve({ success: false, message: 'Failed to save note' });
      }
    }, 500);
  });
}