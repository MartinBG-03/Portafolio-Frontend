import { Component, forwardRef, input, model } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AdControlAccessor } from '../ad-form-field/ad-field-control';

@Component({
  selector: 'ad-switch',
  templateUrl: './ad-switch.html',
  styleUrl: './ad-switch.scss',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AdSwitch), multi: true }],
})
export class AdSwitch extends AdControlAccessor<boolean> {
  readonly checked = model(false);
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
