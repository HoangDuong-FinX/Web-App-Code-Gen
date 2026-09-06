import type { Booking } from '../App';
import { t } from '../i18n/vi';

interface BookingsListProps {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  onSelectBooking: (bookingId: string) => void;
  onRetry: () => void;
}

export function BookingsList({
  bookings,
  loading,
  error,
  onSelectBooking,
  onRetry,
}: BookingsListProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold">{t('bookings_list_title')}</h1>
        <div className="text-center text-gray-500">{t('loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold">{t('bookings_list_title')}</h1>
        <div
          role="alert"
          aria-live="assertive"
          className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded"
          aria-label={t('error_unable_to_load_bookings')}
        >
          {t('error_unable_to_load_bookings')}
        </div>
        <button
          onClick={onRetry}
          aria-label={t('retry')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 p-4">
      <h1 className="text-2xl font-bold mb-4">{t('bookings_list_title')}</h1>
      {bookings.length === 0 ? (
        <div className="text-center text-gray-500">{t('no_bookings')}</div>
      ) : (
        <div className="space-y-2">
          {bookings.map((booking) => (
            <button
              key={booking.bookingId}
              onClick={() => onSelectBooking(booking.bookingId)}
              aria-label={t('select_booking')}
              className="w-full text-left p-4 border border-gray-200 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <div className="font-semibold text-gray-900">{booking.hotelName}</div>
              <div className="text-sm text-gray-600">
                {booking.checkInDate} - {booking.checkOutDate} • {booking.roomType}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
