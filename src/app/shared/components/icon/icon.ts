import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ICONS, IconName } from './icon-registry';

@Component({
  selector: 'app-icon',
  template: '',
  styleUrl: './icon.scss',
  host: {
    'aria-hidden': 'true',
    '[innerHTML]': 'markup()',
  },
})
export class Icon {
  private readonly sanitizer = inject(DomSanitizer);

  readonly name = input.required<IconName>();

  protected readonly markup = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(ICONS[this.name()]),
  );
}
