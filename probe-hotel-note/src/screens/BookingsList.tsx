import React from 'react';
import { useEffect, useState } from 'react';
import { loadBookings } from '../fixtures/bookings';
import { Booking } from '../types';
import { Text } from '../components/Text';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import './BookingsList.css';

interface BookingsListProps {
  onSelectBooking: (bookingId: string, note: string) => void;
}

export function BookingsList({ onSelectBooking }: BookingsListProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const data = loadBookings();
    setBookings(data);
  }, []);

  return (
    <div className="bookings-list-screen">
      <div className="bookings-list-container">
        <Text variant="heading-1" className="bookings-list-title">
          My Bookings
        </Text>
        <div className="bookings-list-items">
          {bookings.map((booking) => (
            <Card
              key={booking.id}
              interactive
              onClick={() => onSelectBooking(booking.id, booking.note)}
              className="booking-card"
            >
              <div className="booking-card-content">
                <Text
                  variant="heading-3"
                  role="booking-hotel-name"
                  className="booking-hotel-name"
                >
                  {booking.hotelName}
                </Text>
                <Text
                  variant="body-2"
                  color="secondary"
                  role="booking-dates"
                  className="booking-dates"
                >
                  {booking.checkInDate} – {booking.checkOutDate}
                </Text>
                <Badge
                  variant={booking.statusVariant}
                  role="booking-status"
                  className="booking-status-badge"
                >
                  {booking.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}