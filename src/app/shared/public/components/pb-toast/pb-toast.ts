import { booleanAttribute, Component, computed, inject, input, output } from '@angular/core';
import { LanguageService } from '../../../../core/public/services/language.service';
import { Icon } from '../../../components/icon/icon';
import { IconName } from '../../../components/icon/icon-registry';
import { ToastVariant } from '../../interfaces/toast.interface';

const VARIANT_ICONS: Record<ToastVariant, IconName> = {
  success: 'check-circle',
  error: 'error-circle',
  warning: 'warning-circle',
  info: 'info-circle',
};

@Component({
  selector: 'pb-toast',
  imports: [Icon],
  templateUrl: './pb-toast.html',
  styleUrl: './pb-toast.scss',
})
export class PbToast {
  protected readonly t = inject(LanguageService).t;

  readonly variant = input<ToastVariant>('info');
  readonly heading = input.required<string>();
  readonly description = input<string>();
  readonly dismissible = input(false, { transform: booleanAttribute });

  readonly dismissed = output<void>();

  protected readonly icon = computed(() => VARIANT_ICONS[this.variant()]);
  protected readonly role = computed(() =>
    this.variant() === 'error' || this.variant() === 'warning' ? 'alert' : 'status',
  );
}
