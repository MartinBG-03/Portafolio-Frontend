import { booleanAttribute, Component, computed, input } from '@angular/core';
import { AdTooltipDirective } from '../../directives/ad-tooltip.directive';

export type AdIconButtonVariant = 'outline' | 'ghost';
export type AdIconButtonSize = 'md' | 'sm';

@Component({
  selector: 'ad-icon-button',
  imports: [AdTooltipDirective],
  templateUrl: './ad-icon-button.html',
  styleUrl: './ad-icon-button.scss',
})
export class AdIconButton {
  readonly label = input.required<string>();
  readonly variant = input<AdIconButtonVariant>('outline');
  readonly size = input<AdIconButtonSize>('md');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly pressed = input<boolean>();
  readonly expanded = input<boolean>();
  readonly popup = input<string>();

  protected readonly controlClass = computed(
    () => `ad-icon-button ad-icon-button--${this.variant()} ad-icon-button--${this.size()}`,
  );
}
