import { useEffect, useState } from 'react';
import { loadBookings } from '../fixtures/bookings';
import type { Booking } from '../types';
import { t } from '../i18n/vi';

interface BookingsListProps {
  onSelectBooking: (bookingId: string) => void;
}

export default function BookingsList({ onSelectBooking }: BookingsListProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      const data = loadBookings();
      setBookings(data);
    } catch (err) {
      setError(t('error_load_bookings'));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    try {
      const data = loadBookings();
      setBookings(data);
    } catch (err) {
      setError(t('error_load_bookings'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t('my_hotel_bookings')}</h1>
        <div className="text-gray-600">{t('loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t('my_hotel_bookings')}</h1>
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-700">{error}</p>
        </div>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          aria-label={t('retry')}
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t('my_hotel_bookings')}</h1>
      <div className="space-y-2">
        {bookings.map((booking) => (
          <button
            key={booking.id}
            onClick={() => onSelectBooking(booking.id)}
            className="w-full text-left p-4 border border-gray-200 rounded hover:bg-gray-50 transition"
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
