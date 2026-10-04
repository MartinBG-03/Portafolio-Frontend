import { Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { localized } from '../../../utils/localized';
import { AD_FIELD_TEXTS } from '../../constants/ad-texts.constants';
import { AdFieldControl } from '../ad-form-field/ad-field-control';
import { AdFormField } from '../ad-form-field/ad-form-field';
import { AdIcon } from '../ad-icon/ad-icon';

@Component({
  selector: 'ad-number-field',
  imports: [AdFormField, AdIcon],
  templateUrl: './ad-number-field.html',
  styleUrl: './ad-number-field.scss',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AdNumberField), multi: true },
  ],
})
export class AdNumberField extends AdFieldControl<number> {
  readonly min = input<number>();
  readonly max = input<number>();
  readonly step = input(1);

  protected readonly texts = localized(AD_FIELD_TEXTS);

  protected onInput(event: Event): void {
    const control = event.target as HTMLInputElement;
    const parsed = control.valueAsNumber;
    this.commit(control.value === '' || Number.isNaN(parsed) ? null : parsed);
  }

  protected stepBy(direction: 1 | -1): void {
    const step = this.step();
    const next = (this.value() ?? 0) + direction * step;
    this.commit(this.clamp(Number(next.toFixed(this.decimals(step)))));
    this.touch();
  }

  protected canStep(direction: 1 | -1): boolean {
    if (this.isDisabled()) {
      return false;
    }
    const limit = direction === 1 ? this.max() : this.min();
    const current = this.value();
    return (
      limit === undefined ||
      current === null ||
      (direction === 1 ? current < limit : current > limit)
    );
  }

  private clamp(value: number): number {
    const min = this.min();
    const max = this.max();
    return Math.min(max ?? Infinity, Math.max(min ?? -Infinity, value));
  }

  private decimals(step: number): number {
    return (String(step).split('.')[1] ?? '').length;
  }
}
