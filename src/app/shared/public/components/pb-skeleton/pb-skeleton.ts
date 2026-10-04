import { Component, input } from '@angular/core';

@Component({
  selector: 'pb-skeleton',
  template: '',
  styleUrl: './pb-skeleton.scss',
  host: {
    class: 'pb-skeleton',
    '[style.width]': 'width()',
    '[style.height]': 'aspectRatio() ? "auto" : height()',
    '[style.aspect-ratio]': 'aspectRatio()',
    '[style.border-radius]': 'radius()',
  },
})
export class PbSkeleton {
  readonly width = input('100%');
  readonly height = input('1rem');
  readonly radius = input('var(--radius)');
  readonly aspectRatio = input<string | null>(null);
}
