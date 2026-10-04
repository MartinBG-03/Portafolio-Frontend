import { booleanAttribute, Component, computed, input, output } from '@angular/core';
import { localized } from '../../../utils/localized';
import { AD_FIELD_TEXTS } from '../../constants/ad-texts.constants';
import { AdIcon } from '../ad-icon/ad-icon';
import { AdIconName } from '../ad-icon/ad-icon-registry';
import { AdIconButton } from '../ad-icon-button/ad-icon-button';

export type AdAlertTone = 'success' | 'warning' | 'error' | 'info';

const ALERT_ICONS: Record<AdAlertTone, AdIconName> = {
  success: 'check-circle',
  warning: 'warning-circle',
  error: 'error-circle',
  info: 'info-circle',
};

@Component({
  selector: 'ad-alert',
  imports: [AdIcon, AdIconButton],
  templateUrl: './ad-alert.html',
  styleUrl: './ad-alert.scss',
})
export class AdAlert {
  readonly tone = input<AdAlertTone>('info');
  readonly heading = input.required<string>();
  readonly dismissible = input(false, { transform: booleanAttribute });
  readonly dismissLabel = input<string>();

  readonly dismissed = output<void>();

  private readonly texts = localized(AD_FIELD_TEXTS);

  protected readonly dismissText = computed(() => this.dismissLabel() ?? this.texts().dismissAlert);
  protected readonly icon = computed(() => ALERT_ICONS[this.tone()]);
  protected readonly role = computed(() => (this.tone() === 'error' ? 'alert' : 'status'));
  protected readonly alertClass = computed(() => `ad-alert ad-alert--${this.tone()}`);
}
