import { booleanAttribute, Component, computed, input } from '@angular/core';

export type AdButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type AdButtonSize = 'md' | 'sm';
export type AdButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'ad-button',
  templateUrl: './ad-button.html',
  styleUrl: './ad-button.scss',
  host: {
    '[class.is-block]': 'block()',
  },
})
export class AdButton {
  readonly variant = input<AdButtonVariant>('primary');
  readonly size = input<AdButtonSize>('md');
  readonly type = input<AdButtonType>('button');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly block = input(false, { transform: booleanAttribute });

  protected readonly controlClass = computed(() =>
    [
      'ad-button',
      `ad-button--${this.variant()}`,
      `ad-button--${this.size()}`,
      this.block() ? 'ad-button--block' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );
}
