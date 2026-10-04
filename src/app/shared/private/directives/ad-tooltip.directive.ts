import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  DestroyRef,
  Directive,
  ElementRef,
  EnvironmentInjector,
  inject,
  input,
} from '@angular/core';
import { AdTooltip } from '../components/ad-tooltip/ad-tooltip';
import {
  AD_TOOLTIP_GAP,
  AD_TOOLTIP_SHOW_DELAY,
  AD_TOOLTIP_VIEWPORT_MARGIN,
} from '../constants/ad-tooltip.constants';
import { AdTooltipPlacement } from '../interfaces/ad-tooltip.interface';

@Directive({
  selector: '[adTooltip]',
  host: {
    '(mouseenter)': 'schedule()',
    '(mouseleave)': 'hide()',
    '(focusin)': 'onFocusIn($event)',
    '(focusout)': 'hide()',
    '(click)': 'hide()',
    '(keydown.escape)': 'hide()',
  },
})
export class AdTooltipDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(EnvironmentInjector);

  readonly adTooltip = input<string | null | undefined>('');
  readonly adTooltipPlacement = input<AdTooltipPlacement>('bottom');

  private tooltip: ComponentRef<AdTooltip> | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private readonly hideOnScroll = (): void => this.hide();

  constructor() {
    inject(DestroyRef).onDestroy(() => this.hide());
  }

  protected onFocusIn(event: FocusEvent): void {
    if ((event.target as HTMLElement | null)?.matches(':focus-visible')) {
      this.schedule();
    }
  }

  protected schedule(): void {
    if (this.tooltip || this.timer !== null || !this.text()) {
      return;
    }
    this.timer = setTimeout(() => {
      this.timer = null;
      this.show();
    }, AD_TOOLTIP_SHOW_DELAY);
  }

  protected hide(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (!this.tooltip) {
      return;
    }
    this.document.removeEventListener('scroll', this.hideOnScroll, { capture: true });
    this.host.nativeElement.removeAttribute('aria-describedby');
    this.appRef.detachView(this.tooltip.hostView);
    this.tooltip.destroy();
    this.tooltip = null;
  }

  private show(): void {
    const text = this.text();
    if (!text || !this.host.nativeElement.isConnected) {
      return;
    }

    const tooltip = createComponent(AdTooltip, { environmentInjector: this.injector });
    tooltip.instance.text.set(text);
    this.appRef.attachView(tooltip.hostView);
    this.document.body.appendChild(tooltip.location.nativeElement);
    tooltip.changeDetectorRef.detectChanges();
    this.tooltip = tooltip;

    const element = this.host.nativeElement;
    if (element.getAttribute('aria-label') !== text && element.textContent?.trim() !== text) {
      element.setAttribute('aria-describedby', tooltip.instance.id);
    }

    this.place(tooltip);
    this.document.addEventListener('scroll', this.hideOnScroll, { capture: true, passive: true });
  }

  private place(tooltip: ComponentRef<AdTooltip>): void {
    const view = this.document.defaultView;
    const panel = (tooltip.location.nativeElement as HTMLElement).firstElementChild;
    if (!view || !panel) {
      return;
    }

    const anchor = this.host.nativeElement.getBoundingClientRect();
    const { width, height } = panel.getBoundingClientRect();

    const below = anchor.bottom + AD_TOOLTIP_GAP;
    const above = anchor.top - height - AD_TOOLTIP_GAP;
    const fitsBelow = below + height <= view.innerHeight - AD_TOOLTIP_VIEWPORT_MARGIN;
    const fitsAbove = above >= AD_TOOLTIP_VIEWPORT_MARGIN;
    const placement: AdTooltipPlacement =
      this.adTooltipPlacement() === 'top'
        ? fitsAbove || !fitsBelow
          ? 'top'
          : 'bottom'
        : fitsBelow || !fitsAbove
          ? 'bottom'
          : 'top';

    const centered = anchor.left + anchor.width / 2 - width / 2;
    const maxLeft = view.innerWidth - width - AD_TOOLTIP_VIEWPORT_MARGIN;
    const left = Math.min(Math.max(AD_TOOLTIP_VIEWPORT_MARGIN, centered), Math.max(AD_TOOLTIP_VIEWPORT_MARGIN, maxLeft));

    tooltip.instance.position.set({ top: placement === 'top' ? above : below, left, placement });
    tooltip.changeDetectorRef.detectChanges();
  }

  private text(): string {
    return this.adTooltip()?.trim() ?? '';
  }
}
