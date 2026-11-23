import { ClockZoneMode } from '../types/exam';

export function formatRemainingTime(
  totalSeconds: number,
  showSeconds = true
): string {
  const safeSeconds = Math.max(0, Math.ceil(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  if (!showSeconds && safeSeconds >= 60) {
    return hours > 0 ? `${hh}:${mm}` : `${mm} min`;
  }

  return hours > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function formatDurationLabel(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins} min`;
  if (mins === 0) return `${hrs} hr`;
  return `${hrs} hr ${mins} min`;
}

export function formatWallClock(
  date: Date,
  zone: ClockZoneMode,
  includeSeconds = false
): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      ...(includeSeconds ? { second: '2-digit' } : {}),
      hour12: true,
      ...(zone === 'riyadh' ? { timeZone: 'Asia/Riyadh' } : {}),
    }).format(date);
  } catch {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

export function formatDateHeader(date: Date, zone: ClockZoneMode): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      ...(zone === 'riyadh' ? { timeZone: 'Asia/Riyadh' } : {}),
    }).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}
