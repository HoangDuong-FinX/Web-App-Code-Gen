import React from 'react';
import { Booking } from '../types';
import Text from './Text';
import Badge from './Badge';
import './BookingRow.css';

interface BookingRowProps {
  booking: Booking;
  onTap: () => void;
}

const BookingRow: React.FC<BookingRowProps> = ({ booking, onTap }) => {
  return (
    <div className="booking-row" onClick={onTap} role="button" tabIndex={0} onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onTap();
      }
    }}>
      <div className="booking-row-content">
        <Text variant="bodyStrong" role="booking-hotel-name">
          {booking.hotelName}
        </Text>
        <Text variant="body" role="booking-dates">
          {booking.checkInDate} – {booking.checkOutDate}
        </Text>
      </div>
      <Badge role="booking-status" className={`badge--${booking.status}`}>
        {booking.status}
      </Badge>
    </div>
  );
};

export default BookingRow;