// i18n translation table
export const i18n = {
  en: {
    // Bookings List
    'bookings-list.title': 'My Hotel Bookings',
    'bookings-list.empty': 'No bookings found',
    'bookings-list.error': 'Unable to load bookings',
    'bookings-list.retry': 'Retry',
    
    // Booking Detail
    'booking-detail.title': 'Booking Details',
    'booking-detail.label-checkin': 'Check-in:',
    'booking-detail.label-checkout': 'Check-out:',
    'booking-detail.label-reference': 'Reference:',
    'booking-detail.note-label': 'Personal Note (optional)',
    'booking-detail.note-placeholder': 'Add a personal note...',
    'booking-detail.character-count': '{count}/200 characters',
    'booking-detail.button-back': 'Back',
    'booking-detail.button-save': 'Save Note',
    'booking-detail.button-back-aria': 'Back to bookings list',
    'booking-detail.button-save-aria': 'Save booking note',
    'booking-detail.success': 'Note saved',
    'booking-detail.error-timeout': 'Request timed out. Please try again.',
    'booking-detail.error-generic': 'Failed to save note. Please try again.',
    
    // Booking Detail Save Failed
    'booking-detail-failed.title': 'Booking Details',
    'booking-detail-failed.label-checkin': 'Check-in:',
    'booking-detail-failed.label-checkout': 'Check-out:',
    'booking-detail-failed.label-reference': 'Reference:',
    'booking-detail-failed.note-label': 'Personal Note (optional)',
    'booking-detail-failed.note-placeholder': 'Add a personal note...',
    'booking-detail-failed.character-count': '{count}/200 characters',
    'booking-detail-failed.error-message': 'Failed to save note. Please try again.',
    'booking-detail-failed.button-discard': 'Discard Changes',
    'booking-detail-failed.button-retry': 'Retry',
    'booking-detail-failed.button-discard-aria': 'Discard changes and return to bookings list',
    'booking-detail-failed.button-retry-aria': 'Retry saving booking note',
  }
} as const;

export function t(key: keyof typeof i18n.en, params?: Record<string, string | number>): string {
  const value = i18n.en[key] as string;
  if (!value) return key;
  if (!params) return value;
  let result = value;
  Object.entries(params).forEach(([k, v]) => {
    result = result.replace(`{${k}}`, String(v));
  });
  return result;
}
