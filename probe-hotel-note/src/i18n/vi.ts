type TranslationKey =
  | 'bookings.title'
  | 'bookings.empty'
  | 'bookings.viewDetails'
  | 'bookings.dates'
  | 'bookings.status'
  | 'booking.noteLabel'
  | 'booking.notePlaceholder'
  | 'booking.noteAriaLabel'
  | 'booking.charCount'
  | 'booking.saveButton'
  | 'booking.retryButton'
  | 'booking.saveFailed'
  | 'booking.reference'
  | 'common.back'
  | 'common.backArrow'
  | 'common.loading'
  | 'common.saving';

interface TranslationParams {
  [key: string]: string | number;
}

const translations: Record<TranslationKey, string> = {
  'bookings.title': 'My Hotel Bookings',
  'bookings.empty': 'No bookings yet',
  'bookings.viewDetails': 'View booking details',
  'bookings.dates': '{checkIn} to {checkOut}',
  'bookings.status': 'Status: {status}',
  'booking.noteLabel': 'Notes (max 200 characters)',
  'booking.notePlaceholder': 'Add a note about this booking',
  'booking.noteAriaLabel': 'Booking note',
  'booking.charCount': '{current} / {max}',
  'booking.saveButton': 'Save Note',
  'booking.retryButton': 'Retry Save',
  'booking.saveFailed': 'Failed to save note. Please try again.',
  'booking.reference': 'Booking ref: {ref}',
  'common.back': 'Back to bookings',
  'common.backArrow': '← Back',
  'common.loading': 'Loading...',
  'common.saving': 'Saving...',
};

function interpolate(template: string, params?: TranslationParams): string {
  if (!params) return template;
  return template.replace(/{(\w+)}/g, (_, key) => String(params[key] ?? '{' + key + '}'));
}

export function t(key: TranslationKey, params?: TranslationParams): string {
  const template = translations[key] ?? key;
  return interpolate(template, params);
}
