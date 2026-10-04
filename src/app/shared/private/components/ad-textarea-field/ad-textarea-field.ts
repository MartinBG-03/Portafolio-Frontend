import { Component, computed, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AdFieldControl } from '../ad-form-field/ad-field-control';
import { AdFormField } from '../ad-form-field/ad-form-field';

@Component({
  selector: 'ad-textarea-field',
  imports: [AdFormField],
  templateUrl: './ad-textarea-field.html',
  styleUrl: './ad-textarea-field.scss',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AdTextareaField), multi: true },
  ],
})
export class AdTextareaField extends AdFieldControl<string> {
  readonly rows = input(4);
  readonly maxLength = input<number>();

  protected readonly length = computed(() => (this.value() ?? '').length);

  protected onInput(event: Event): void {
    this.commit((event.target as HTMLTextAreaElement).value);
  }
}
