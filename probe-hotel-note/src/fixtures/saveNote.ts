export interface SaveNoteResult {
  success: boolean;
  message?: string;
}

export async function saveNoteFixture(
  bookingId: string,
  noteText: string
): Promise<SaveNoteResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simulate occasional failure (30% chance) for testing error path
  if (Math.random() < 0.3) {
    return {
      success: false,
      message: 'Network error: Failed to save note',
    };
  }

  // Success path
  return {
    success: true,
    message: 'Note saved successfully',
  };
}
