import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export type MediaCardTone = 'web' | 'mobile' | 'automation';

@Component({
  selector: 'pb-media-card',
  imports: [RouterLink],
  templateUrl: './pb-media-card.html',
  styleUrl: './pb-media-card.scss',
})
export class PbMediaCard {
  readonly kind = input.required<string>();
  readonly date = input.required<string>();
  readonly heading = input.required<string>();
  readonly path = input.required<string>();
  readonly queryParams = input<Readonly<Record<string, string>>>();
  readonly tone = input<MediaCardTone>('web');

  protected readonly cardClass = computed(() => `pb-media-card pb-media-card--${this.tone()}`);
}
