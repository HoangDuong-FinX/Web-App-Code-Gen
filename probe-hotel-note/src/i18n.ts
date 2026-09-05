// Internationalization module
const translations = {
  'my-bookings': 'My Bookings',
  'add-a-note': 'Add a note',
  'save-note': 'Save Note',
  'back': 'Back',
  'retry': 'Retry',
  'failed-to-save-note': 'Failed to save note',
  'note-placeholder': 'Enter your note here',
  'note-aria-label': 'Note input, maximum 200 characters',
  'note-helper': '{{ count }}/200 characters',
  'save-success': 'Note saved successfully',
  'save-button-aria': 'Save Note',
  'retry-button-aria': 'Retry saving note',
  'back-button-aria': 'Back',
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, vars?: Record<string, string | number>): string {
  let result = translations[key];
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      result = result.replace(`{{ ${k} }}`, String(v));
    });
  }
  return result;
}
