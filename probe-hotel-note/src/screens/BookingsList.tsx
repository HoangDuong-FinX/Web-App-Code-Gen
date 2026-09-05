import React, { useEffect, useState } from 'react';
import { Booking } from '../types';
import { loadBookingsList } from '../fixtures/bookings';
import { Stack } from '../components/Stack';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { t } from '../i18n/vi';

interface BookingsListProps {
  onSelectBooking: (booking: Booking) => void;
}

export function BookingsList({ onSelectBooking }: BookingsListProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await loadBookingsList();
        setBookings(data);
      } catch (error) {
        console.error('Failed to load bookings:', error);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, []);

  return (
    <Stack direction="column" gap="4" className="bookings-list">
      <Text variant="title">{t('bookings.title')}</Text>
      
      {isLoading && <Text>{t('common.loading')}</Text>}
      
      {!isLoading && bookings.length === 0 && (
        <EmptyState>{t('bookings.empty')}</EmptyState>
      )}
      
      {!isLoading && bookings.length > 0 && (
        <div className="bookings-list-items">
          {bookings.map((booking) => (
            <Button
              key={booking.bookingId}
              variant="ghost"
              aria-label={t('bookings.viewDetails', { hotelName: booking.hotelName })}
              onClick={() => onSelectBooking(booking)}
              className="booking-row"
            >
              <Stack direction="column" gap="1" alignment="start">
                <Text variant="body-strong">{booking.hotelName}</Text>
                <Text variant="body-small">
                  {t('bookings.dates', {
                    checkIn: booking.checkInDate,
                    checkOut: booking.checkOutDate,
                  })}
                </Text>
                <Text variant="body-small" color="secondary">
                  {t('bookings.status', { status: booking.status })}
                </Text>
              </Stack>
            </Button>
          ))}
        </div>
      )}
    </Stack>
  );
}