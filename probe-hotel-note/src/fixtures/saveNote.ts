// Fixture: save note with deterministic failure control
let saveNoteOutcome: 'success' | 'fail' = 'success';

export function setSaveNoteOutcome(outcome: 'success' | 'fail'): void {
  saveNoteOutcome = outcome;
}

export function getSaveNoteOutcome(): 'success' | 'fail' {
  return saveNoteOutcome;
}

export interface SaveNoteRequest {
  bookingId: string;
  noteText: string;
}

export interface SaveNoteResponse {
  success: boolean;
  bookingId: string;
  noteText: string;
}

export async function saveNote(req: SaveNoteRequest): Promise<SaveNoteResponse> {
  // Simulate async save with deterministic outcome
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (saveNoteOutcome === 'success') {
        resolve({
          success: true,
          bookingId: req.bookingId,
          noteText: req.noteText,
        });
      } else {
        reject(new Error('Failed to save note'));
      }
    }, 500);
  });
}
