import React from 'react';
import { Stack } from '../components/Stack';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { t } from '../i18n/vi';
import type { Booking, ScreenId } from '../types/index';

interface BookingsListProps {
  bookings: Booking[];
  onSelectBooking: (bookingId: string) => void;
}

export const BookingsList: React.FC<BookingsListProps> = ({
  bookings,
  onSelectBooking,
}) => {
  if (bookings.length === 0) {
    return (
      <Stack direction="column" gap="16" className="p-4">
        <Text variant="heading1">{t('bookings.list.heading')}</Text>
        <Text variant="body">{t('bookings.empty')}</Text>
      </Stack>
    );
  }

  return (
    <Stack direction="column" gap="16" className="p-4">
      <Text variant="heading1">{t('bookings.list.heading')}</Text>
      <Stack direction="column" gap="8">
        {bookings.map((booking) => (
          <Button
            key={booking.bookingId}
            variant="ghost"
            ariaLabel={t('booking.detail.selectBooking')}
            onClick={() => onSelectBooking(booking.bookingId)}
            className="border border-gray-200 rounded-md p-3 text-left hover:bg-gray-50"
          >
            <Stack direction="column" gap="8" alignItems="flex-start">
              <Text variant="body-strong">{booking.hotelName}</Text>
              <Text variant="body-secondary">
                {booking.checkIn} to {booking.checkOut}
              </Text>
              <Text variant="caption">
                {t('booking.detail.confirmation')}{booking.confirmationNumber}
              </Text>
            </Stack>
          </Button>
        ))}
      </Stack>
    </Stack>
  );
};
