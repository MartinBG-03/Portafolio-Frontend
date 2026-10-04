import { booleanAttribute, Component, forwardRef, input, model } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AdControlAccessor } from '../ad-form-field/ad-field-control';
import { AdIcon } from '../ad-icon/ad-icon';

@Component({
  selector: 'ad-checkbox',
  imports: [AdIcon],
  templateUrl: './ad-checkbox.html',
  styleUrl: './ad-checkbox.scss',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AdCheckbox), multi: true },
  ],
})
export class AdCheckbox extends AdControlAccessor<boolean> {
  readonly checked = model(false);
  readonly indeterminate = input(false, { transform: booleanAttribute });
  readonly label = input<string>();

  override writeValue(value: boolean | null): void {
    this.checked.set(value === true);
  }

  protected onToggle(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.checked.set(checked);
    this.commit(checked);
  }
}
