// Fixture: hotel bookings list
export interface Booking {
  id: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  location: string;
}

export const bookingsFixture: Booking[] = [
  {
    id: 'booking-1',
    hotelName: 'Grand Hotel Vienna',
    checkInDate: '2025-06-15',
    checkOutDate: '2025-06-18',
    location: 'Vienna, Austria',
  },
  {
    id: 'booking-2',
    hotelName: 'Lakeside Resort',
    checkInDate: '2025-07-01',
    checkOutDate: '2025-07-05',
    location: 'Zurich, Switzerland',
  },
  {
    id: 'booking-3',
    hotelName: 'Urban Boutique Hotel',
    checkInDate: '2025-08-10',
    checkOutDate: '2025-08-12',
    location: 'Berlin, Germany',
  },
];

export async function loadBookings(): Promise<Booking[]> {
  // Simulate async load
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(bookingsFixture);
    }, 100);
  });
}
