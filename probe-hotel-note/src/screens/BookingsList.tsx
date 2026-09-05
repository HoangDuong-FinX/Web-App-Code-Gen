import React, { useEffect, useState } from 'react';
import type { Booking } from '../types';
import { loadBookingsFixture } from '../fixtures/bookings';
import Text from '../components/Text';
import BookingRow from '../components/BookingRow';
import './BookingsList.css';

interface BookingsListProps {
  onSelectBooking: (booking: Booking) => void;
}

const BookingsList: React.FC<BookingsListProps> = ({ onSelectBooking }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        const data = await loadBookingsFixture();
        setBookings(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bookings');
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  return (
    <div className="bookings-list-screen">
      <div className="bookings-list-header">
        <Text variant="pageTitle">My Bookings</Text>
      </div>

      {loading && <div className="bookings-list-loading">Loading bookings...</div>}

      {error && <div className="bookings-list-error">Error: {error}</div>}

      {!loading && bookings.length === 0 && (
        <div className="bookings-list-empty">No bookings found</div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="bookings-list-content">
          {bookings.map((booking) => (
            <BookingRow key={booking.bookingId} booking={booking} onTap={() => onSelectBooking(booking)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsList;