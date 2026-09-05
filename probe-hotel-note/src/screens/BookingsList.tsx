import { loadBookings } from '../fixtures/bookings';
import Text from '../components/Text';
import Card from '../components/Card';
import { i18n } from '../i18n/vi';

interface BookingsListProps {
  onSelectBooking: (bookingId: string) => void;
}

export default function BookingsList({ onSelectBooking }: BookingsListProps) {
  const bookings = loadBookings();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Text variant="title">{i18n['screen.bookings_list.title']}</Text>
      {bookings.length === 0 ? (
        <Text variant="body-secondary">{i18n['screen.bookings_list.empty']}</Text>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {bookings.map(booking => (
            <Card
              key={booking.bookingId}
              interactive
              onClick={() => onSelectBooking(booking.bookingId)}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Text variant="body-strong">{booking.hotelName}</Text>
                <Text variant="body-secondary">
                  {booking.checkInDate} – {booking.checkOutDate}
                </Text>
                <Text variant="body-secondary">{booking.location}</Text>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}