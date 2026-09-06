import React, { useState, useEffect } from 'react';
import { Text } from '../ui/Text';
import { Button } from '../ui/Button';
import { t } from '../i18n';
import { loadBookingsList, Booking } from '../fixtures/bookings';

export interface BookingsListProps {
  onSelectBooking: (bookingId: string) => void;
}

export const BookingsList: React.FC<BookingsListProps> = ({ onSelectBooking }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await loadBookingsList();
        setBookings(data);
      } catch (err) {
        setError(t('bookings-list.error'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Text variant="body">Loading...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Text variant="body">{error}</Text>
        <Button onClick={() => window.location.reload()}>
          {t('bookings-list.retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <Text variant="heading1">{t('bookings-list.title')}</Text>
      <div className="flex flex-col gap-2">
        {bookings.length === 0 ? (
          <Text variant="body">{t('bookings-list.empty')}</Text>
        ) : (
          bookings.map((booking) => (
            <Button
              key={booking.id}
              variant="ghost"
              fullWidth
              onClick={() => onSelectBooking(booking.id)}
              ariaLabel={`${booking.hotelName} from ${booking.checkInDate} to ${booking.checkOutDate}`}
            >
              <div className="flex flex-col gap-1 w-full text-left">
                <Text variant="body-bold" role="hotel-name">
                  {booking.hotelName}
                </Text>
                <Text variant="caption" color="text-secondary" role="booking-dates">
                  {booking.checkInDate} – {booking.checkOutDate}
                </Text>
                <Text variant="caption" color="text-secondary" role="booking-status">
                  {booking.bookingStatus}
                </Text>
              </div>
            </Button>
          ))
        )}
      </div>
    </div>
  );
};
