import { Component, computed, input } from '@angular/core';
import { AdIcon } from '../ad-icon/ad-icon';
import { AdIconName } from '../ad-icon/ad-icon-registry';

@Component({
  selector: 'ad-page-header',
  imports: [AdIcon],
  templateUrl: './ad-page-header.html',
  styleUrl: './ad-page-header.scss',
})
export class AdPageHeader {
  readonly heading = input.required<string>();
  readonly description = input<string>();
  readonly icon = input<AdIconName>();

  protected readonly glyph = computed(() => this.heading().charAt(0));
}
