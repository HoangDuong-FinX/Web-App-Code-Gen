interface SaveNoteResult {
  success: boolean;
  message?: string;
}

let saveNoteOutcome: 'success' | 'failure' = 'success';

export async function saveNote(
  _bookingId: string,
  _noteText: string,
): Promise<SaveNoteResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (saveNoteOutcome === 'success') {
        resolve({ success: true, message: 'Note saved' });
      } else {
        resolve({ success: false, message: 'Failed to save note' });
      }
    }, 300);
  });
}

export function setSaveNoteOutcome(outcome: 'success' | 'failure'): void {
  saveNoteOutcome = outcome;
}

export function resetSaveNoteOutcome(): void {
  saveNoteOutcome = 'success';
}
