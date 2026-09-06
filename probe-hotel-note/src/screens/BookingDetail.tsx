import React from 'react';
import { useTranslation } from '../i18n/vi';
import Text from '../components/Text';

const BookingDetail: React.FC<{bookingId: string; onNavigate: any}> = ({bookingId, onNavigate}) => {
  const t = useTranslation();
  return <Text variant='body'>BookingDetail screen for {bookingId}</Text>;
};

export default BookingDetail;