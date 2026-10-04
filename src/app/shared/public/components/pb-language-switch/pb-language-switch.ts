import { Component, computed, ElementRef, inject, signal } from '@angular/core';
import { Language } from '../../../../core/public/i18n/language';
import { LanguageService } from '../../../../core/public/services/language.service';
import { Icon } from '../../../components/icon/icon';
import { AdTooltipDirective } from '../../../private/directives/ad-tooltip.directive';

interface LanguageOption {
  readonly code: Language;
  readonly name: string;
}

@Component({
  selector: 'pb-language-switch',
  imports: [Icon, AdTooltipDirective],
  templateUrl: './pb-language-switch.html',
  styleUrl: './pb-language-switch.scss',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(keydown.escape)': 'onEscape()',
  },
})
export class PbLanguageSwitch {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly languageService = inject(LanguageService);

  protected readonly options: readonly LanguageOption[] = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
  ];

  protected readonly open = signal(false);

  protected readonly current = computed(
    () =>
      this.options.find((option) => option.code === this.languageService.language()) ??
      this.options[0],
  );

  protected readonly tooltip = computed(() =>
    this.languageService.t().language.tooltip.replace('{name}', this.current().name),
  );

  protected toggle(): void {
    this.open.update((open) => !open);
  }

  protected select(code: Language, event: MouseEvent): void {
    this.languageService.setLanguage(code);
    this.open.set(false);
    if (event.detail === 0) {
      this.focusTrigger();
    }
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }

  protected onEscape(): void {
    if (this.open()) {
      this.open.set(false);
      this.focusTrigger();
    }
  }

  private focusTrigger(): void {
    this.host.nativeElement.querySelector<HTMLElement>('.pb-language-switch__trigger')?.focus();
  }
}
