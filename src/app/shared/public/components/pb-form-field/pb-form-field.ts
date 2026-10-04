import { Component, input } from '@angular/core';
import { fieldMessageId } from './field-control';

@Component({
  selector: 'pb-form-field',
  templateUrl: './pb-form-field.html',
  styleUrl: './pb-form-field.scss',
})
export class PbFormField {
  readonly controlId = input.required<string>();
  readonly label = input.required<string>();
  readonly hint = input<string>();
  readonly error = input<string | null>(null);
  readonly required = input(false);

  protected readonly fieldMessageId = fieldMessageId;
}
