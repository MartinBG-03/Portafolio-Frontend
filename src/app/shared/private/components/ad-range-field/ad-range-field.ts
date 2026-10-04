import { Component, computed, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AdFieldControl } from '../ad-form-field/ad-field-control';
import { AdFormField } from '../ad-form-field/ad-form-field';

@Component({
  selector: 'ad-range-field',
  imports: [AdFormField],
  templateUrl: './ad-range-field.html',
  styleUrl: './ad-range-field.scss',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AdRangeField), multi: true },
  ],
})
export class AdRangeField extends AdFieldControl<number> {
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly unit = input('');

  protected readonly displayValue = computed(() => `${this.value() ?? this.min()}${this.unit()}`);

  protected onInput(event: Event): void {
    const control = event.target as HTMLInputElement;
    this.commit(control.valueAsNumber);
  }
}
