import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AD_ICONS, AdIconName } from './ad-icon-registry';

@Component({
  selector: 'ad-icon',
  template: '',
  styleUrl: './ad-icon.scss',
  host: {
    'aria-hidden': 'true',
    '[innerHTML]': 'markup()',
  },
})
export class AdIcon {
  private readonly sanitizer = inject(DomSanitizer);

  readonly name = input.required<AdIconName>();

  protected readonly markup = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(AD_ICONS[this.name()]),
  );
}
