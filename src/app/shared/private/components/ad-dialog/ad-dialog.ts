import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { localized } from '../../../utils/localized';
import { AD_COMMON_TEXTS } from '../../constants/ad-texts.constants';
import { AdButton } from '../ad-button/ad-button';
import { adUniqueId } from '../ad-form-field/ad-field-control';
import { AdIcon } from '../ad-icon/ad-icon';
import { AdIconButton } from '../ad-icon-button/ad-icon-button';

export type AdDialogSize = 'sm' | 'md' | 'lg';
export type AdDialogConfirmVariant = 'primary' | 'danger';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const AUTOFOCUS = '[data-autofocus]';
const BODY = '.ad-dialog__body';
const FOOTER = '.ad-dialog__footer';

let scrollLocks = 0;

@Component({
  selector: 'ad-dialog',
  imports: [AdButton, AdIcon, AdIconButton],
  templateUrl: './ad-dialog.html',
  styleUrl: './ad-dialog.scss',
})
export class AdDialog {
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);

  readonly open = model(false);
  readonly heading = input.required<string>();
  readonly size = input<AdDialogSize>('md');
  readonly confirmLabel = input<string>();
  readonly cancelLabel = input<string>();
  readonly confirmVariant = input<AdDialogConfirmVariant>('primary');
  readonly confirmDisabled = input(false, { transform: booleanAttribute });
  readonly closeLabel = input<string>();

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  private readonly texts = localized(AD_COMMON_TEXTS);

  protected readonly titleId = adUniqueId('ad-dialog-title');
  protected readonly confirmText = computed(() => this.confirmLabel() ?? this.texts().save);
  protected readonly cancelText = computed(() => this.cancelLabel() ?? this.texts().cancel);
  protected readonly closeText = computed(() => this.closeLabel() ?? this.texts().close);

  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private wasOpen = false;
  private previouslyFocused: HTMLElement | null = null;

  constructor() {
    effect(() => {
      if (this.open()) {
        this.onOpened();
      } else {
        this.onClosed();
      }
    });

    inject(DestroyRef).onDestroy(() => this.onClosed());
  }

  protected cancel(): void {
    this.open.set(false);
    this.cancelled.emit();
  }

  protected confirm(): void {
    this.confirmed.emit();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  private onOpened(): void {
    if (this.wasOpen) {
      return;
    }
    this.wasOpen = true;
    this.previouslyFocused = this.document.activeElement as HTMLElement | null;
    scrollLocks += 1;
    this.document.body.style.overflow = 'hidden';

    afterNextRender(() => this.focusInitial(), { injector: this.injector });
  }

  private onClosed(): void {
    if (!this.wasOpen) {
      return;
    }
    this.wasOpen = false;
    scrollLocks = Math.max(0, scrollLocks - 1);
    if (scrollLocks === 0) {
      this.document.body.style.overflow = '';
    }
    this.previouslyFocused?.focus();
    this.previouslyFocused = null;
  }

  private focusables(): HTMLElement[] {
    const panel = this.panel()?.nativeElement;
    return panel ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];
  }

  private focusInitial(): void {
    const panel = this.panel()?.nativeElement;
    if (!panel) {
      return;
    }

    const marked = panel.querySelector<HTMLElement>(AUTOFOCUS);
    const body = panel.querySelector<HTMLElement>(BODY);
    const footer = panel.querySelector<HTMLElement>(FOOTER);
    const target =
      (marked?.matches(FOCUSABLE) ? marked : marked?.querySelector<HTMLElement>(FOCUSABLE)) ??
      body?.querySelector<HTMLElement>(FOCUSABLE) ??
      footer?.querySelector<HTMLElement>(FOCUSABLE) ??
      this.focusables()[0] ??
      panel;

    target.focus();
  }

  private trapFocus(event: KeyboardEvent): void {
    const focusables = this.focusables();
    if (focusables.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = this.document.activeElement as HTMLElement | null;
    const panel = this.panel()?.nativeElement;

    if (event.shiftKey && (active === first || !panel?.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !panel?.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  }
}
