import { Component, computed, input, model, output } from '@angular/core';
import { localized } from '../../../utils/localized';
import { AD_COMMON_TEXTS } from '../../constants/ad-texts.constants';
import { AdDialog } from '../ad-dialog/ad-dialog';

export type AdConfirmTone = 'primary' | 'danger';

@Component({
  selector: 'ad-confirm-dialog',
  imports: [AdDialog],
  templateUrl: './ad-confirm-dialog.html',
  styleUrl: './ad-confirm-dialog.scss',
})
export class AdConfirmDialog {
  readonly open = model(false);
  readonly heading = input.required<string>();
  readonly confirmLabel = input<string>();
  readonly cancelLabel = input<string>();
  readonly tone = input<AdConfirmTone>('primary');

  readonly confirmed = output<void>();

  private readonly texts = localized(AD_COMMON_TEXTS);

  protected readonly confirmText = computed(() => this.confirmLabel() ?? this.texts().confirm);
  protected readonly cancelText = computed(() => this.cancelLabel() ?? this.texts().cancel);

  protected confirm(): void {
    this.open.set(false);
    this.confirmed.emit();
  }
}
