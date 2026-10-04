import { booleanAttribute, Component, input } from '@angular/core';
import { localized } from '../../../utils/localized';
import { AD_COMMON_TEXTS } from '../../constants/ad-texts.constants';
import { adFieldLabelId, adFieldMessageId } from './ad-field-control';

@Component({
  selector: 'ad-form-field',
  templateUrl: './ad-form-field.html',
  styleUrl: './ad-form-field.scss',
})
export class AdFormField {
  readonly controlId = input.required<string>();
  readonly label = input.required<string>();
  readonly hint = input<string>();
  readonly error = input<string | null>(null);
  readonly labelHidden = input(false, { transform: booleanAttribute });
  readonly optional = input(false, { transform: booleanAttribute });

  protected readonly texts = localized(AD_COMMON_TEXTS);
  protected readonly messageId = adFieldMessageId;
  protected readonly labelId = adFieldLabelId;
}
