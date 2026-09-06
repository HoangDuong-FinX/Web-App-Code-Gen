// Fixture for save-note and retry-save-note bindings

export interface SaveNoteRequest {
  bookingId: string;
  noteText: string;
}

export interface SaveNoteResponse {
  success: boolean;
  message?: string;
}

let saveNoteOutcome: 'success' | 'fail' | 'timeout' = 'success';

export function setSaveNoteOutcome(outcome: 'success' | 'fail' | 'timeout') {
  saveNoteOutcome = outcome;
}

export function resetSaveNoteOutcome() {
  saveNoteOutcome = 'success';
}

export async function saveNote(request: SaveNoteRequest): Promise<SaveNoteResponse> {
  return new Promise((resolve, reject) => {
    const timeoutMs = saveNoteOutcome === 'timeout' ? 5100 : 300;
    const timeout = setTimeout(() => {
      if (saveNoteOutcome === 'timeout') {
        reject(new Error('Request timed out'));
      } else if (saveNoteOutcome === 'fail') {
        reject(new Error('Failed to save note'));
      } else {
        resolve({ success: true, message: 'Note saved' });
      }
    }, timeoutMs);

    // Allow cancellation for timeout simulation
    if (saveNoteOutcome === 'timeout') {
      setTimeout(() => {
        clearTimeout(timeout);
        reject(new Error('Request timed out'));
      }, 5000);
    }
  });
}
