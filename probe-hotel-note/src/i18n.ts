export const translations = {
  'page-title-bookings': 'My Hotel Bookings',
  'page-title-detail': 'Booking Details',
  'page-title-detail-failed': 'Booking Details',
  'heading-bookings': 'My Hotel Bookings',
  'label-note': 'Personal Note',
  'placeholder-note': 'Enter your personal note',
  'button-save-note': 'Save Note',
  'button-retry-save': 'Retry Save',
  'success-note-saved': 'Note saved successfully',
  'error-save-failed': 'Failed to save note. Please try again.',
  'label-booking-dates': 'Booking dates',
  'label-booking-reference': 'Reference',
  'label-character-count': 'Character count: {count} out of 200',
  'text-bookings-empty': 'Bookings will appear here once the backend endpoint is available',
  'aria-booking-card': 'Booking for {hotelName} from {startDate} to {endDate}',
  'aria-hotel-name': 'Hotel name',
  'aria-booking-status': 'Booking status: {status}',
  'aria-character-counter': 'Character count: {count} out of 200',
  'aria-note-input': 'Personal note input field, maximum 200 characters',
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, params?: Record<string, string | number>): string {
  let text = translations[key];
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  return text;
}