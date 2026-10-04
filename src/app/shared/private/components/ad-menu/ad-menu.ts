import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { AdMenuItem } from '../../interfaces/ad-menu.interface';
import { AdIcon } from '../ad-icon/ad-icon';
import { AdIconName } from '../ad-icon/ad-icon-registry';
import { AdIconButton } from '../ad-icon-button/ad-icon-button';

const PANEL_GAP = 4;
const VIEWPORT_MARGIN = 8;
const ENABLED_ITEM = '[role="menuitem"]:not(:disabled)';

@Component({
  selector: 'ad-menu',
  imports: [AdIcon, AdIconButton],
  templateUrl: './ad-menu.html',
  styleUrl: './ad-menu.scss',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(window:resize)': 'close()',
  },
})
export class AdMenu {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);

  readonly label = input.required<string>();
  readonly items = input.required<readonly AdMenuItem[]>();
  readonly icon = input<AdIconName>('dots');

  readonly selected = output<string>();

  protected readonly open = signal(false);
  protected readonly position = signal({ top: 0, left: 0 });

  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private anchor: DOMRect | null = null;
  private readonly closeWhenAnchorMoves = (): void => {
    const current = this.triggerButton()?.getBoundingClientRect();
    const origin = this.anchor;
    if (
      !current ||
      !origin ||
      Math.abs(current.top - origin.top) > 1 ||
      Math.abs(current.left - origin.left) > 1
    ) {
      this.close();
    }
  };

  constructor() {
    inject(DestroyRef).onDestroy(() => this.detachScrollListener());
  }

  protected toggle(): void {
    if (this.open()) {
      this.close();
    } else {
      this.show();
    }
  }

  protected openFromKeyboard(event: Event): void {
    event.preventDefault();
    if (!this.open()) {
      this.show();
    }
  }

  protected choose(item: AdMenuItem): void {
    if (item.disabled) {
      return;
    }
    this.close(true);
    this.selected.emit(item.key);
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        this.close(true);
        break;
      case 'Tab':
        this.close();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.moveFocus(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.moveFocus(-1);
        break;
      case 'Home':
        event.preventDefault();
        this.focusItem(0);
        break;
      case 'End':
        event.preventDefault();
        this.focusItem(-1);
        break;
    }
  }

  protected close(refocus = false): void {
    if (!this.open()) {
      return;
    }
    this.open.set(false);
    this.detachScrollListener();
    if (refocus) {
      this.triggerButton()?.focus();
    }
  }

  private show(): void {
    const trigger = this.triggerButton();
    if (!trigger) {
      return;
    }

    const anchor = trigger.getBoundingClientRect();
    this.position.set({ top: anchor.bottom + PANEL_GAP, left: anchor.left });
    this.open.set(true);
    this.anchor = anchor;
    this.document.addEventListener('scroll', this.closeWhenAnchorMoves, {
      capture: true,
      passive: true,
    });

    afterNextRender(
      () => {
        this.keepInsideViewport(anchor);
        this.focusItem(0);
      },
      { injector: this.injector },
    );
  }

  private keepInsideViewport(anchor: DOMRect): void {
    const panel = this.panel()?.nativeElement;
    const view = this.document.defaultView;
    if (!panel || !view) {
      return;
    }

    const { width, height } = panel.getBoundingClientRect();
    let { left } = anchor;
    let top = anchor.bottom + PANEL_GAP;

    if (left + width > view.innerWidth - VIEWPORT_MARGIN) {
      left = Math.max(VIEWPORT_MARGIN, view.innerWidth - width - VIEWPORT_MARGIN);
    }
    if (top + height > view.innerHeight - VIEWPORT_MARGIN) {
      top = Math.max(VIEWPORT_MARGIN, anchor.top - height - PANEL_GAP);
    }

    this.position.set({ top, left });
  }

  private enabledItems(): HTMLElement[] {
    const panel = this.panel()?.nativeElement;
    return panel ? Array.from(panel.querySelectorAll<HTMLElement>(ENABLED_ITEM)) : [];
  }

  private focusItem(index: number): void {
    const items = this.enabledItems();
    items.at(index)?.focus();
  }

  private moveFocus(direction: 1 | -1): void {
    const items = this.enabledItems();
    if (items.length === 0) {
      return;
    }
    const current = items.indexOf(this.document.activeElement as HTMLElement);
    const next = (current + direction + items.length) % items.length;
    items[next].focus();
  }

  private triggerButton(): HTMLButtonElement | null {
    return this.host.nativeElement.querySelector<HTMLButtonElement>('ad-icon-button button');
  }

  private detachScrollListener(): void {
    this.document.removeEventListener('scroll', this.closeWhenAnchorMoves, { capture: true });
    this.anchor = null;
  }
}
