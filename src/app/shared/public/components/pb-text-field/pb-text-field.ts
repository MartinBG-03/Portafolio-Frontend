import { Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldControl } from '../pb-form-field/field-control';
import { PbFormField } from '../pb-form-field/pb-form-field';

export type TextFieldType = 'text' | 'email' | 'tel' | 'url' | 'password' | 'number';

@Component({
  selector: 'pb-text-field',
  imports: [PbFormField],
  templateUrl: './pb-text-field.html',
  styleUrl: './pb-text-field.scss',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PbTextField), multi: true },
  ],
})
export class PbTextField extends FieldControl<string | number> {
  readonly type = input<TextFieldType>('text');
  readonly autocomplete = input<string>();

  protected onInput(event: Event): void {
    const control = event.target as HTMLInputElement;
    if (this.type() !== 'number') {
      this.commit(control.value);
      return;
    }
    this.commit(control.value === '' ? null : control.valueAsNumber);
  }
}
