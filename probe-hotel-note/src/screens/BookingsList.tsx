import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/vi';
import { getBookings } from '../fixtures/bookings';
import Text from '../components/Text';
import Button from '../components/Button';

interface BookingItem {
  bookingId: string;
  hotelName: string;
  dateRange: string;
  confirmationNumber: string;
}

interface BookingsListProps {
  onNavigate: (screen: 'booking-detail', params: { bookingId: string }) => void;
}

const BookingsList: React.FC<BookingsListProps> = ({ onNavigate }) => {
  const t = useTranslation();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const data = getBookings();
      if (data.length === 0) {
        setError(t('error.unable_to_load_bookings'));
      } else {
        setBookings(data);
        setError(null);
      }
    } catch (err) {
      setError(t('error.unable_to_load_bookings'));
    }
  }, [t]);

  const handleSelectBooking = (bookingId: string) => {
    onNavigate('booking-detail', { bookingId });
  };

  return (
    <div className="flex flex-col gap-8">
      <Text variant="heading" className="text-2xl font-bold">
        {t('screen.bookings_list.title')}
      </Text>
      {error ? (
        <div className="flex flex-col gap-4">
          <Text variant="body" className="text-red-600">{error}</Text>
          <Button variant="primary" onClick={() => window.location.reload()} aria-label={t('action.retry')}>
            {t('action.retry')}
          </Button>
        </div>
      ) : bookings.length === 0 ? (
        <Text variant="body" className="text-gray-500">{t('screen.bookings_list.no_bookings')}</Text>
      ) : (
        <div className="flex flex-col gap-12">
          {bookings.map((booking) => (
            <Button key={booking.bookingId} variant="ghost" onClick={() => handleSelectBooking(booking.bookingId)} aria-label={t('action.view_booking').replace('{{ hotelName }}', booking.hotelName)} className="flex flex-col items-start gap-1 p-0 hover:opacity-80">
              <Text variant="body-strong" className="text-base font-semibold">{booking.hotelName}</Text>
              <Text variant="caption" className="text-sm text-gray-600">{booking.dateRange}</Text>
              <Text variant="caption" className="text-sm text-gray-600">{t('booking.confirmation').replace('{{ confirmationNumber }}', booking.confirmationNumber)}</Text>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsList;