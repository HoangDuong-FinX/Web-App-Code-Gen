import React, { useEffect, useState } from 'react';
import { Booking, loadBookings } from '../fixtures/bookings';
import { Text } from '../components/Text';
import { ListItem } from '../components/ListItem';
import { t } from '../i18n';

interface BookingsListProps {
  onSelectBooking: (bookingId: string) => void;
}

export const BookingsList: React.FC<BookingsListProps> = ({ onSelectBooking }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings().then((data) => {
      setBookings(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-4">{t('my-bookings')}</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <Text variant="title">{t('my-bookings')}</Text>
      <div className="flex flex-col gap-3 overflow-y-auto max-h-96">
        {bookings.map((booking) => (
          <ListItem key={booking.id} onTap={() => onSelectBooking(booking.id)}>
            <Text variant="subtitle">{booking.hotelName}</Text>
            <Text variant="body">
              {booking.checkInDate} – {booking.checkOutDate}
            </Text>
            <Text variant="caption">{booking.location}</Text>
          </ListItem>
        ))}
      </div>
    </div>
  );
};
