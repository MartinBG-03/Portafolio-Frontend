import { Component, computed, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { localized } from '../../../utils/localized';
import { AD_FIELD_TEXTS } from '../../constants/ad-texts.constants';
import { AdOption, AdOptionValue } from '../../interfaces/ad-option.interface';
import { AdChip } from '../ad-chip/ad-chip';
import { adFieldLabelId, AdFieldControl } from '../ad-form-field/ad-field-control';
import { AdFormField } from '../ad-form-field/ad-form-field';

@Component({
  selector: 'ad-chip-group',
  imports: [AdFormField, AdChip],
  templateUrl: './ad-chip-group.html',
  styleUrl: './ad-chip-group.scss',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AdChipGroup), multi: true },
  ],
})
export class AdChipGroup extends AdFieldControl<readonly AdOptionValue[]> {
  readonly options = input.required<readonly AdOption[]>();
  readonly emptyText = input<string>();

  private readonly texts = localized(AD_FIELD_TEXTS);

  protected readonly emptyMessage = computed(() => this.emptyText() ?? this.texts().noOptions);

  protected readonly labelId = computed(() => adFieldLabelId(this.controlId));
  private readonly selected = computed(() => new Set(this.value() ?? []));

  protected isSelected(value: AdOptionValue): boolean {
    return this.selected().has(value);
  }

  protected toggle(value: AdOptionValue, selected: boolean): void {
    const current = this.value() ?? [];
    this.commit(
      selected ? [...current.filter((item) => item !== value), value] : current.filter((item) => item !== value),
    );
    this.touch();
  }
}
