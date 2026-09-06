// Fixture for load-booking-detail binding

export interface BookingDetail {
  id: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  bookingReference: string;
  noteText: string | null;
}

let bookingDetailLoadOutcome: 'success' | 'fail' = 'success';

export function setBookingDetailLoadOutcome(outcome: 'success' | 'fail') {
  bookingDetailLoadOutcome = outcome;
}

export function resetBookingDetailLoadOutcome() {
  bookingDetailLoadOutcome = 'success';
}

const mockBookingDetails: Record<string, BookingDetail> = {
  'booking-1': {
    id: 'booking-1',
    hotelName: 'Grand Hotel Downtown',
    checkInDate: '2024-09-15',
    checkOutDate: '2024-09-18',
    bookingReference: 'GHD-2024-001',
    noteText: 'Early check-in requested',
  },
  'booking-2': {
    id: 'booking-2',
    hotelName: 'Beachside Resort',
    checkInDate: '2024-10-01',
    checkOutDate: '2024-10-07',
    bookingReference: 'BSR-2024-002',
    noteText: null,
  },
  'booking-3': {
    id: 'booking-3',
    hotelName: 'Mountain Lodge',
    checkInDate: '2024-11-10',
    checkOutDate: '2024-11-12',
    bookingReference: 'ML-2024-003',
    noteText: null,
  },
};

export async function loadBookingDetail(bookingId: string): Promise<BookingDetail> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (bookingDetailLoadOutcome === 'fail') {
        reject(new Error('Failed to load booking detail'));
      } else {
        const detail = mockBookingDetails[bookingId];
        if (detail) {
          resolve(detail);
        } else {
          reject(new Error('Booking not found'));
        }
      }
    }, 100);
  });
}
