import { Component, computed, input } from '@angular/core';
import { Icon } from '../../../components/icon/icon';

export type CircleArrowTone = 'ink' | 'accent' | 'light';

@Component({
  selector: 'pb-circle-arrow',
  imports: [Icon],
  templateUrl: './pb-circle-arrow.html',
  styleUrl: './pb-circle-arrow.scss',
  host: { 'aria-hidden': 'true' },
})
export class PbCircleArrow {
  readonly tone = input<CircleArrowTone>('ink');

  protected readonly circleClass = computed(() => `pb-circle-arrow pb-circle-arrow--${this.tone()}`);
}
