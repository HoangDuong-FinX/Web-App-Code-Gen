export interface Translations {
  'bookings.title': string;
  'bookings.loadError': string;
  'bookingDetail.title': string;
  'bookingDetail.loadError': string;
  'bookingDetail.checkInLabel': string;
  'bookingDetail.checkOutLabel': string;
  'bookingDetail.referenceLabel': string;
  'bookingDetail.noteLabel': string;
  'bookingDetail.notePlaceholder': string;
  'bookingDetail.characterCount': string;
  'bookingDetail.backButton': string;
  'bookingDetail.saveButton': string;
  'bookingDetail.saveFailed': string;
  'bookingDetail.saveSuccess': string;
  'bookingDetailSaveFailed.title': string;
  'bookingDetailSaveFailed.discardButton': string;
  'bookingDetailSaveFailed.retryButton': string;
  'bookingDetailSaveFailed.errorMessage': string;
}

const translations: Translations = {
  'bookings.title': 'My Hotel Bookings',
  'bookings.loadError': 'Unable to load bookings',
  'bookingDetail.title': 'Booking Details',
  'bookingDetail.loadError': 'Unable to load booking details',
  'bookingDetail.checkInLabel': 'Check-in:',
  'bookingDetail.checkOutLabel': 'Check-out:',
  'bookingDetail.referenceLabel': 'Reference:',
  'bookingDetail.noteLabel': 'Personal Note (optional)',
  'bookingDetail.notePlaceholder': 'Add a personal note...',
  'bookingDetail.characterCount': '{count}/200 characters',
  'bookingDetail.backButton': 'Back',
  'bookingDetail.saveButton': 'Save Note',
  'bookingDetail.saveFailed': 'Failed to save note. Please try again.',
  'bookingDetail.saveSuccess': 'Note saved',
  'bookingDetailSaveFailed.title': 'Booking Details',
  'bookingDetailSaveFailed.discardButton': 'Discard Changes',
  'bookingDetailSaveFailed.retryButton': 'Retry',
  'bookingDetailSaveFailed.errorMessage': 'Failed to save note. Please try again.',
};

export function useTranslation() {
  const t = (key: keyof Translations): string => {
    return translations[key];
  };

  const tWithParam = (key: keyof Translations, params: Record<string, string | number>): string => {
    let result = translations[key];
    Object.entries(params).forEach(([k, v]) => {
      result = result.replace(`{${k}}`, String(v));
    });
    return result;
  };

  return { t, tWithParam };
}
