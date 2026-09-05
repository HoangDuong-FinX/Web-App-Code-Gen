export const i18n = {
  en: {
    'app.title': 'Hotel Note',
    'bookings.title': 'My Hotel Bookings',
    'bookings.empty': 'No bookings loaded',
    'detail.title': 'Booking Details',
    'detail.notes-label': 'Notes',
    'detail.note-placeholder': 'Enter your note here...',
    'detail.character-count': '{current} / 200',
    'detail.save-button': 'Save Note',
    'detail.save-button-aria': 'Save note for this booking',
    'detail.confirmation-number': 'Confirmation: {confirmationNumber}',
    'detail.check-in-out': '{checkInDate} – {checkOutDate}',
    'error.save-failed': 'Failed to save note. Please check your connection and try again.',
    'error.retry-button': 'Retry',
    'error.retry-button-aria': 'Retry saving the note',
    'note.input-aria': 'Add or edit booking note',
  },
};

export function t(key: string, params?: Record<string, string | number>): string {
  let text = i18n.en[key as keyof typeof i18n.en] || key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  return text;
}
