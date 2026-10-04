import { Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldControl } from '../pb-form-field/field-control';
import { PbFormField } from '../pb-form-field/pb-form-field';

@Component({
  selector: 'pb-textarea-field',
  imports: [PbFormField],
  templateUrl: './pb-textarea-field.html',
  styleUrl: './pb-textarea-field.scss',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PbTextareaField), multi: true },
  ],
})
export class PbTextareaField extends FieldControl<string> {
  readonly rows = input(4);

  protected onInput(event: Event): void {
    this.commit((event.target as HTMLTextAreaElement).value);
  }
}
