import { booleanAttribute, Component, computed, input } from '@angular/core';
import { ButtonType } from '../pb-button/pb-button';

export type IconButtonVariant = 'primary' | 'secondary' | 'neutral' | 'destructive';

@Component({
  selector: 'pb-icon-button',
  templateUrl: './pb-icon-button.html',
  styleUrl: './pb-icon-button.scss',
})
export class PbIconButton {
  readonly label = input.required<string>();
  readonly variant = input<IconButtonVariant>('primary');
  readonly type = input<ButtonType>('button');
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly controlClass = computed(
    () => `pb-icon-button pb-icon-button--${this.variant()}`,
  );
}
