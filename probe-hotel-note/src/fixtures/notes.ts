export interface Note {
  noteId: string;
  bookingId: string;
  text: string;
  savedAt: string;
}

const FIXTURE_NOTES: Map<string, Note> = new Map();

export function loadNote(bookingId: string): Note | null {
  return FIXTURE_NOTES.get(bookingId) || null;
}

export function saveNote(bookingId: string, noteText: string): { success: boolean; error?: string } {
  // Simulate fixture save with deterministic control for testing
  const shouldFail = (globalThis as any).__TEST_SAVE_NOTE_FAIL__ || false;
  
  if (shouldFail) {
    return { success: false, error: 'Network error' };
  }

  const note: Note = {
    noteId: `note-${Date.now()}`,
    bookingId,
    text: noteText,
    savedAt: new Date().toISOString(),
  };
  FIXTURE_NOTES.set(bookingId, note);
  return { success: true };
}

export function setSaveNoteFail(shouldFail: boolean) {
  (globalThis as any).__TEST_SAVE_NOTE_FAIL__ = shouldFail;
}