import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'media'
  | 'media-outline'
  | 'ink';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'pb-button',
  imports: [NgTemplateOutlet, RouterLink],
  templateUrl: './pb-button.html',
  styleUrl: './pb-button.scss',
  host: {
    '[class.is-block]': 'block()',
  },
})
export class PbButton {
  readonly variant = input<ButtonVariant>('primary');
  readonly type = input<ButtonType>('button');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly pill = input(false, { transform: booleanAttribute });
  readonly block = input(false, { transform: booleanAttribute });
  readonly expanded = input<boolean>();
  readonly link = input<string>();
  readonly queryParams = input<Readonly<Record<string, string>>>();
  readonly href = input<string>();
  readonly download = input(false, { transform: booleanAttribute });
  readonly target = input<'_blank' | '_self'>();

  protected readonly controlClass = computed(() =>
    [
      'pb-button',
      `pb-button--${this.variant()}`,
      this.pill() ? 'pb-button--pill' : '',
      this.block() ? 'pb-button--block' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  protected onLinkClick(event: Event): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
