import React from 'react';
import { useTranslation } from '../i18n';
import { Booking } from '../types';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Stack } from '../components/Stack';
import { Alert } from '../components/Alert';

interface BookingsListProps {
  bookings: Booking[];
  error?: string | null;
  onSelectBooking: (bookingId: string) => void;
}

export function BookingsList({ bookings, error, onSelectBooking }: BookingsListProps) {
  const { t } = useTranslation();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Stack direction="column" gap="md" fullWidth>
        <Text variant="heading1" role="heading">
          {t('bookings.title')}
        </Text>

        {error && (
          <Alert variant="error" visible={true}>
            {error}
          </Alert>
        )}

        {!error && bookings.length === 0 && (
          <Text variant="body" color="text-secondary">
            No bookings found
          </Text>
        )}

        {!error && bookings.map((booking) => (
          <Button
            key={booking.id}
            variant="ghost"
            fullWidth
            onClick={() => onSelectBooking(booking.id)}
            className="text-left p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            aria-label={`Select booking at ${booking.hotelName}`}
          >
            <Stack direction="column" gap="xs" alignItems="flex-start" fullWidth>
              <Text variant="body-bold" role="hotel-name">
                {booking.hotelName}
              </Text>
              <Text variant="caption" color="text-secondary" role="booking-dates">
                {booking.checkInDate} – {booking.checkOutDate}
              </Text>
              <Text variant="caption" color="text-secondary" role="booking-status">
                {booking.bookingStatus}
              </Text>
            </Stack>
          </Button>
        ))}
      </Stack>
    </div>
  );
}

export default BookingsList;
