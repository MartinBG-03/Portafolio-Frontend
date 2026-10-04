import { computed, DOCUMENT, effect, inject, Injectable, signal } from '@angular/core';
import { DEFAULT_LANGUAGE, isLanguage, Language } from '../i18n/language';
import { translations } from '../i18n/translations';

const STORAGE_KEY = 'language';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);

  readonly language = signal<Language>(this.readStoredLanguage() ?? DEFAULT_LANGUAGE);
  readonly t = computed(() => translations[this.language()]);

  constructor() {
    effect(() => {
      this.document.documentElement.lang = this.language();
    });
  }

  setLanguage(language: Language): void {
    this.language.set(language);
    this.storeLanguage(language);
  }

  private readStoredLanguage(): Language | null {
    try {
      const stored = this.document.defaultView?.localStorage.getItem(STORAGE_KEY);
      return isLanguage(stored) ? stored : null;
    } catch {
      return null;
    }
  }

  private storeLanguage(language: Language): void {
    try {
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      return;
    }
  }
}
