import { Localized } from '../../core/public/i18n/language';

export type IsoDate = string;

export interface CalendarDay {
  readonly iso: IsoDate;
  readonly day: number;
  readonly inMonth: boolean;
}

export const WEEKDAY_LETTERS: Localized<readonly string[]> = {
  es: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
  en: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
};

const pad = (value: number, length = 2): string => String(value).padStart(length, '0');

export function toIso(year: number, month: number, day: number): IsoDate {
  return `${pad(year, 4)}-${pad(month)}-${pad(day)}`;
}

export function parseIso(iso: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) {
    return null;
  }
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(Date.UTC(year, month - 1, day));
  const valid =
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  return valid ? { year, month, day } : null;
}

export function todayIso(now: Date = new Date()): IsoDate {
  return toIso(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function addDays(iso: IsoDate, delta: number): IsoDate {
  const parts = parseIso(iso);
  if (!parts) {
    return iso;
  }
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + delta));
  return toIso(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

export function addMonths(iso: IsoDate, delta: number): IsoDate {
  const parts = parseIso(iso);
  if (!parts) {
    return iso;
  }
  const target = new Date(Date.UTC(parts.year, parts.month - 1 + delta, 1));
  const lastDay = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0),
  ).getUTCDate();
  return toIso(target.getUTCFullYear(), target.getUTCMonth() + 1, Math.min(parts.day, lastDay));
}

export function weekdayIndex(iso: IsoDate): number {
  const parts = parseIso(iso);
  if (!parts) {
    return 0;
  }
  return (new Date(Date.UTC(parts.year, parts.month - 1, parts.day)).getUTCDay() + 6) % 7;
}

export function formatDisplay(iso: IsoDate | null): string {
  const parts = iso ? parseIso(iso) : null;
  return parts ? `${pad(parts.day)}/${pad(parts.month)}/${pad(parts.year, 4)}` : '';
}

export function parseDisplay(text: string): IsoDate | null {
  const match = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(text.trim());
  if (!match) {
    return null;
  }
  const iso = toIso(Number(match[3]), Number(match[2]), Number(match[1]));
  return parseIso(iso) ? iso : null;
}

export function monthLabel(iso: IsoDate, locale = 'es'): string {
  const parts = parseIso(iso);
  if (!parts) {
    return '';
  }
  const month = new Intl.DateTimeFormat(locale, { month: 'long', timeZone: 'UTC' }).format(
    new Date(Date.UTC(parts.year, parts.month - 1, 1)),
  );
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${parts.year}`;
}

export function longDateLabel(iso: IsoDate, locale = 'es'): string {
  const parts = parseIso(iso);
  if (!parts) {
    return '';
  }
  return new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeZone: 'UTC' }).format(
    new Date(Date.UTC(parts.year, parts.month - 1, parts.day)),
  );
}

export function monthGrid(iso: IsoDate): CalendarDay[][] {
  const parts = parseIso(iso);
  if (!parts) {
    return [];
  }
  const first = toIso(parts.year, parts.month, 1);
  const lastDay = new Date(Date.UTC(parts.year, parts.month, 0)).getUTCDate();
  const start = addDays(first, -weekdayIndex(first));
  const weeks = Math.ceil((weekdayIndex(first) + lastDay) / 7);

  return Array.from({ length: weeks }, (_, week) =>
    Array.from({ length: 7 }, (_, dayOfWeek) => {
      const dayIso = addDays(start, week * 7 + dayOfWeek);
      const dayParts = parseIso(dayIso) as { year: number; month: number; day: number };
      return { iso: dayIso, day: dayParts.day, inMonth: dayParts.month === parts.month };
    }),
  );
}
