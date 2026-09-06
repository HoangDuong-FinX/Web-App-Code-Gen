import React, { useEffect, useState } from 'react';
import { Booking } from '../types';
import { loadBookings } from '../fixtures/bookings';
import { t } from '../i18n/vi';

interface BookingsListProps {
  onSelectBooking: (booking: Booking, currentNote: string) => void;
}

export default function BookingsList({ onSelectBooking }: BookingsListProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await loadBookings();
        setBookings(data);
        setError(null);
      } catch (err) {
        setError(t('bookings_load_error'));
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">{t('my_hotel_bookings')}</h1>
        <p className="text-gray-600">{t('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">{t('my_hotel_bookings')}</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">{t('my_hotel_bookings')}</h1>
        <p className="text-gray-500">{t('no_bookings_available')}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t('my_hotel_bookings')}</h1>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <button
            key={booking.bookingId}
            onClick={() => onSelectBooking(booking, booking.noteText || '')}
            className="w-full text-left p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            aria-label={t('booking_details')}
          >
            <div className="space-y-1">
              <p className="font-bold text-gray-900">{booking.hotelName}</p>
              <p className="text-sm text-gray-600">
                {booking.checkInDate} – {booking.checkOutDate}
              </p>
              <p className="text-sm text-gray-600">{booking.location}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}