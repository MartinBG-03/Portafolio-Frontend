import { booleanAttribute, Component, forwardRef, input, output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Icon } from '../../../components/icon/icon';
import { ControlAccessor } from '../pb-form-field/field-control';

@Component({
  selector: 'pb-search-field',
  imports: [Icon],
  templateUrl: './pb-search-field.html',
  styleUrl: './pb-search-field.scss',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PbSearchField), multi: true },
  ],
})
export class PbSearchField extends ControlAccessor<string> {
  readonly label = input.required<string>();
  readonly placeholder = input('');
  readonly showShortcut = input(false, { transform: booleanAttribute });

  readonly submitted = output<string>();

  protected onInput(event: Event): void {
    this.commit((event.target as HTMLInputElement).value);
  }

  protected onSubmit(): void {
    this.submitted.emit(this.value() ?? '');
  }
}
