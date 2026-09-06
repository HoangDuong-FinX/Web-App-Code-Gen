import React from 'react';
import { Booking } from '../fixtures';
import { t } from '../i18n';

interface BookingListProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
}

export const BookingList: React.FC<BookingListProps> = ({ bookings, onSelectBooking }) => {
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">{t('page-title-bookings')}</h1>
      {bookings.length === 0 ? (
        <div className="py-8 text-center text-gray-600">{t('text-bookings-empty')}</div>
      ) : (
        <ul className="flex flex-col gap-3">
          {bookings.map((booking) => (
            <li key={booking.id}>
              <button
                onClick={() => onSelectBooking(booking)}
                aria-label={t('aria-booking-card', {
                  hotelName: booking.hotelName,
                  startDate: formatDate(booking.bookingDatesStart),
                  endDate: formatDate(booking.bookingDatesEnd),
                })}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-semibold text-lg mb-2">{booking.hotelName}</div>
                <div className="text-sm text-gray-600 mb-2">
                  {formatDate(booking.bookingDatesStart)} – {formatDate(booking.bookingDatesEnd)}
                </div>
                <div className="text-xs font-medium inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {booking.bookingStatus}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};