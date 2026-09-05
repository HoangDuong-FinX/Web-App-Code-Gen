import { Booking } from '../types';

// Fixture: Load bookings list
// Waiting on: Backend API endpoint for listing user's hotel bookings
export const loadBookingsFixture = async (): Promise<Booking[]> => {
  // Simulate async load with a small delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          bookingId: 'BK001',
          hotelName: 'Grand Hotel Downtown',
          checkInDate: '2025-06-15',
          checkOutDate: '2025-06-18',
          status: 'confirmed',
          guestCount: 2,
          note: '',
        },
        {
          bookingId: 'BK002',
          hotelName: 'Seaside Resort',
          checkInDate: '2025-07-10',
          checkOutDate: '2025-07-17',
          status: 'confirmed',
          guestCount: 4,
          note: '',
        },
        {
          bookingId: 'BK003',
          hotelName: 'Mountain Lodge',
          checkInDate: '2025-05-20',
          checkOutDate: '2025-05-22',
          status: 'completed',
          guestCount: 1,
          note: '',
        },
      ]);
    }, 500);
  });
};

// Fixture: Save booking note
// Waiting on: Backend API endpoint for saving a booking note
export const saveNoteFixture = async (bookingId: string, noteText: string): Promise<{ success: boolean; noteId: string; timestamp: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate 80% success rate for demo purposes
      if (Math.random() > 0.2) {
        resolve({
          success: true,
          noteId: `NOTE_${bookingId}_${Date.now()}`,
          timestamp: new Date().toISOString(),
        });
      } else {
        reject(new Error('Network error: Failed to save note'));
      }
    }, 800);
  });
};