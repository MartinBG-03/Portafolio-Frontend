import { booleanAttribute, Component, input } from '@angular/core';

@Component({
  selector: 'ad-card',
  template: '<ng-content />',
  styleUrl: './ad-card.scss',
  host: {
    '[class.is-flush]': 'flush()',
  },
})
export class AdCard {
  readonly flush = input(false, { transform: booleanAttribute });
}
