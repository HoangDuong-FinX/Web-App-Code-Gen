import { useEffect, useState } from 'react';
import { loadBookings } from '../fixtures/bookings';
import type { Booking } from '../types';
import { i18n } from '../i18n/vi';

interface BookingsListProps {
  onSelectBooking: (bookingId: string) => void;
}

function BookingsList({ onSelectBooking }: BookingsListProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await loadBookings();
        setBookings(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : i18n['error.loadBookings']
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-4">
          {i18n['screen.bookingsList.title']}
        </h1>
        <div className="text-gray-500">{i18n['state.loading']}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-4">
          {i18n['screen.bookingsList.title']}
        </h1>
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-4">
          {i18n['screen.bookingsList.title']}
        </h1>
        <div className="text-gray-500">{i18n['state.empty']}</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">
        {i18n['screen.bookingsList.title']}
      </h1>
      <div className="space-y-3">
        {bookings.map((booking) => (
          <button
            key={booking.id}
            onClick={() => onSelectBooking(booking.id)}
            className="w-full text-left p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            aria-label={`${booking.hotelName}, ${booking.checkInDate} to ${booking.checkOutDate}`}
          >
            <div className="space-y-1">
              <div className="font-bold text-gray-900">{booking.hotelName}</div>
              <div className="text-sm text-gray-600">
                {booking.checkInDate} – {booking.checkOutDate}
              </div>
              <div className="text-sm text-gray-600">{booking.bookingStatus}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default BookingsList;