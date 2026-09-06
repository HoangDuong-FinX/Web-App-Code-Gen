import React from 'react';
import Text from '../components/Text';

const BookingDetail: React.FC<{bookingId: string; onNavigate: any}> = ({bookingId}) => {
  return <Text variant='body'>BookingDetail screen for {bookingId}</Text>;
};

export default BookingDetail;