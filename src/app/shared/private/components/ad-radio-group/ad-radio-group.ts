import { Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AdOption, AdOptionValue } from '../../interfaces/ad-option.interface';
import { adUniqueId, AdControlAccessor } from '../ad-form-field/ad-field-control';

export type AdRadioOrientation = 'vertical' | 'horizontal';

@Component({
  selector: 'ad-radio-group',
  templateUrl: './ad-radio-group.html',
  styleUrl: './ad-radio-group.scss',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AdRadioGroup), multi: true },
  ],
})
export class AdRadioGroup extends AdControlAccessor<AdOptionValue> {
  readonly label = input.required<string>();
  readonly options = input.required<readonly AdOption[]>();
  readonly orientation = input<AdRadioOrientation>('vertical');

  protected readonly name = adUniqueId('ad-radio');

  protected select(option: AdOption): void {
    this.commit(option.value);
  }

  protected isDisabledOption(option: AdOption): boolean {
    return this.isDisabled() || option.disabled === true;
  }
}
