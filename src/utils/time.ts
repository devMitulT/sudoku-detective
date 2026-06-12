/** Format seconds as MM:SS (or H:MM:SS past an hour). */
export function formatTime(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  if (hours > 0) return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  return `${pad(minutes)}:${pad(seconds)}`;
}

/** Format a case number as "#001". */
export const formatCaseNumber = (n: number): string => `#${n.toString().padStart(3, '0')}`;
