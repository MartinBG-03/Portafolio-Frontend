import { Language, Localized } from '../../core/public/i18n/language';

const LOCALES: Localized<string> = { es: 'es-EC', en: 'en-GB' };

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
};

const TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
};

const DATE_FORMATS: Localized<Intl.DateTimeFormat> = {
  es: new Intl.DateTimeFormat(LOCALES.es, DATE_OPTIONS),
  en: new Intl.DateTimeFormat(LOCALES.en, DATE_OPTIONS),
};

const TIME_FORMATS: Localized<Intl.DateTimeFormat> = {
  es: new Intl.DateTimeFormat(LOCALES.es, TIME_OPTIONS),
  en: new Intl.DateTimeFormat(LOCALES.en, TIME_OPTIONS),
};

export function formatDate(value: string | Date, language: Language): string {
  return DATE_FORMATS[language].format(new Date(value));
}

export function formatTime(value: string | Date, language: Language): string {
  return TIME_FORMATS[language].format(new Date(value));
}

export function timeZoneOffsetMinutes(now: Date = new Date()): number {
  return -now.getTimezoneOffset();
}

const LONG_DATE_FORMATS: Localized<Intl.DateTimeFormat> = {
  es: new Intl.DateTimeFormat(LOCALES.es, { day: 'numeric', month: 'long', year: 'numeric' }),
  en: new Intl.DateTimeFormat(LOCALES.en, { day: 'numeric', month: 'long', year: 'numeric' }),
};

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

export function formatLongDate(value: string | Date, language: Language): string {
  const parts = typeof value === 'string' ? DATE_ONLY.exec(value) : null;
  const date = parts ? new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3])) : new Date(value);
  return LONG_DATE_FORMATS[language].format(date);
}
