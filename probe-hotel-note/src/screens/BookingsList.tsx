import React from 'react';
import { Text } from '../components/Text';
import { Card } from '../components/Card';
import { t } from '../i18n';
import { Booking } from '../fixtures/bookings';

interface BookingsListProps {
  bookings: Booking[];
  onSelectBooking: (bookingId: string) => void;
}

export const BookingsList: React.FC<BookingsListProps> = ({ bookings, onSelectBooking }) => {
  if (bookings.length === 0) {
    return (
      <div className="p-6">
        <Text variant="title">{t('bookings.title')}</Text>
        <div className="mt-6 text-center text-gray-500">
          <Text variant="body-secondary">{t('bookings.empty')}</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <Text variant="title">{t('bookings.title')}</Text>
      <div className="space-y-3">
        {bookings.map((booking) => (
          <Card
            key={booking.bookingId}
            interactive
            onTap={() => onSelectBooking(booking.bookingId)}
          >
            <Text variant="body-strong">{booking.hotelName}</Text>
            <Text variant="body-secondary" className="mt-2">
              {t('detail.check-in-out', {
                checkInDate: booking.checkInDate,
                checkOutDate: booking.checkOutDate,
              })}
            </Text>
            <Text variant="body-secondary" className="mt-1">
              {booking.location}
            </Text>
          </Card>
        ))}
      </div>
    </div>
  );
};
