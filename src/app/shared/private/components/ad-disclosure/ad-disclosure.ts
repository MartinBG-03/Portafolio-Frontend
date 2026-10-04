import { Component, input, model } from '@angular/core';
import { adUniqueId } from '../ad-form-field/ad-field-control';
import { AdIcon } from '../ad-icon/ad-icon';

@Component({
  selector: 'ad-disclosure',
  imports: [AdIcon],
  templateUrl: './ad-disclosure.html',
  styleUrl: './ad-disclosure.scss',
})
export class AdDisclosure {
  readonly label = input.required<string>();
  readonly open = model(false);

  protected readonly panelId = adUniqueId('ad-disclosure');

  protected toggle(): void {
    this.open.update((current) => !current);
  }
}
