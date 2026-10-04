import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, Component, computed, input, model, output } from '@angular/core';
import { localized } from '../../../utils/localized';
import { AD_COMMON_TEXTS } from '../../constants/ad-texts.constants';
import { AdIcon } from '../ad-icon/ad-icon';

@Component({
  selector: 'ad-chip',
  imports: [NgTemplateOutlet, AdIcon],
  templateUrl: './ad-chip.html',
  styleUrl: './ad-chip.scss',
})
export class AdChip {
  readonly selectable = input(false, { transform: booleanAttribute });
  readonly selected = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly removable = input(false, { transform: booleanAttribute });
  readonly removeLabel = input<string>();

  readonly removed = output<void>();

  private readonly texts = localized(AD_COMMON_TEXTS);

  protected readonly removeText = computed(() => this.removeLabel() ?? this.texts().remove);

  protected toggle(): void {
    this.selected.update((selected) => !selected);
  }
}
