import { booleanAttribute, Component, computed, input } from '@angular/core';

export type AdBadgeTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

@Component({
  selector: 'ad-badge',
  templateUrl: './ad-badge.html',
  styleUrl: './ad-badge.scss',
})
export class AdBadge {
  readonly tone = input<AdBadgeTone>('neutral');
  readonly dot = input(true, { transform: booleanAttribute });

  protected readonly badgeClass = computed(() => `ad-badge ad-badge--${this.tone()}`);
}
