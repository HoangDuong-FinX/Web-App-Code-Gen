import React from 'react';
import Text from '../components/Text';

const BookingDetailSaveFailed: React.FC<{bookingId: string; onNavigate: any}> = ({bookingId}) => {
  return <Text variant='body'>BookingDetailSaveFailed screen for {bookingId}</Text>;
};

export default BookingDetailSaveFailed;