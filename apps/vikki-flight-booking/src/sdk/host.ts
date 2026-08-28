import type { HostIdentity } from '../types';

export function getHostIdentity(): HostIdentity | null {
  const w = window as unknown as { hostRuntime?: { identity?: HostIdentity } };
  return w.hostRuntime?.identity ?? null;
}

export function canShare(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

export async function shareResult(text: string): Promise<void> {
  if (!canShare()) return;
  try {
    await navigator.share({ title: 'Vikki Flights', text });
  } catch {
    // User cancelled or error - silently ignore
  }
}
