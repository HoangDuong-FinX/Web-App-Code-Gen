// screens/BookingsList.tsx
import React, { useEffect, useState } from 'react';
import { Booking } from '../types';
import { loadBookings } from '../fixtures';
import { t } from '../i18n';
import { Text } from '../components/Text';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';

interface BookingsListProps {
  onSelectBooking: (booking: Booking) => void;
}

export const BookingsList: React.FC<BookingsListProps> = ({ onSelectBooking }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLoadBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await loadBookings();
      setBookings(data);
    } catch (err) {
      setError(t('error.load-bookings-failed'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleLoadBookings();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4">
      <Text variant="heading-lg">{t('bookings-list.title')}</Text>

      {error && (
        <Alert variant="error" visible={true}>
          {error}
          <Button
            variant="secondary"
            onClick={handleLoadBookings}
            className="mt-2 text-sm"
            aria-label={t('error.retry')}
          >
            {t('error.retry')}
          </Button>
        </Alert>
      )}

      {isLoading && <Text>{/* Loading state */}</Text>}

      {!isLoading && bookings.length > 0 && (
        <div className="flex flex-col gap-3">
          {bookings.map((booking) => (
            <Card
              key={booking.referenceId}
              interactive={true}
              onTap={() => onSelectBooking(booking)}
              role="button"
              tabIndex={0}
              aria-label={`${booking.hotelName}, ${booking.checkInDate} to ${booking.checkOutDate}`}
            >
              <Text variant="body-lg" role="booking-hotel-name">
                {booking.hotelName}
              </Text>
              <Text variant="body-sm" role="booking-dates" className="mt-1">
                {booking.checkInDate} – {booking.checkOutDate}
              </Text>
              <Text variant="body-xs" role="booking-reference-id" className="mt-1">
                Ref: {booking.referenceId}
              </Text>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && bookings.length === 0 && !error && (
        <Text>{/* Empty state */}</Text>
      )}
    </div>
  );
};
