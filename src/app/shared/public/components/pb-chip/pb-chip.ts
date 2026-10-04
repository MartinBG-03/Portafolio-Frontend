import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { LanguageService } from '../../../../core/public/services/language.service';
import { Icon } from '../../../components/icon/icon';

export type ChipVariant = 'default' | 'alert' | 'success';

@Component({
  selector: 'pb-chip',
  imports: [NgTemplateOutlet, Icon],
  templateUrl: './pb-chip.html',
  styleUrl: './pb-chip.scss',
})
export class PbChip {
  private readonly t = inject(LanguageService).t;

  readonly variant = input<ChipVariant>('default');
  readonly selectable = input(false, { transform: booleanAttribute });
  readonly controlled = input(false, { transform: booleanAttribute });
  readonly selected = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly removable = input(false, { transform: booleanAttribute });
  readonly removeLabel = input<string>();

  readonly pressed = output<void>();
  readonly removed = output<void>();

  protected readonly chipClass = computed(() => `pb-chip pb-chip--${this.variant()}`);
  protected readonly removeAriaLabel = computed(
    () => this.removeLabel() ?? this.t().chip.remove,
  );

  protected onClick(): void {
    if (!this.controlled()) {
      this.selected.update((selected) => !selected);
    }
    this.pressed.emit();
  }
}
