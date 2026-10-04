import { computed, inject, Signal } from '@angular/core';
import { Localized } from '../../core/public/i18n/language';
import { LanguageService } from '../../core/public/services/language.service';

export function localized<T>(texts: Localized<T>): Signal<T> {
  const language = inject(LanguageService).language;
  return computed(() => texts[language()]);
}
