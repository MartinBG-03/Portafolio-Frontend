import { ElementRef, Component, effect, inject, input, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { Icon } from '../../../../../shared/components/icon/icon';
import { MainNavItem } from '../../../../../shared/public/interfaces/main-nav-item.interface';
import { PbNavMegaMenu } from '../pb-nav-mega-menu/pb-nav-mega-menu';

@Component({
  selector: 'pb-navbar',
  imports: [RouterLink, RouterLinkActive, Icon, PbNavMegaMenu],
  templateUrl: './pb-navbar.html',
  styleUrl: './pb-navbar.scss',
  host: {
    '(document:keydown.escape)': 'onEscape()',
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class PbNavbar {
  private readonly router = inject(Router);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly label = input.required<string>();
  readonly items = input.required<readonly MainNavItem[]>();

  readonly mobileOpen = signal(false);
  protected readonly openMenuId = signal<string | null>(null);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  constructor() {
    effect(() => {
      this.url();
      untracked(() => this.closeAll());
    });
  }

  toggleMobile(): void {
    this.mobileOpen.update((open) => !open);
  }

  protected panelId(id: string): string {
    return `pb-nav-panel-${id}`;
  }

  protected toggleMenu(id: string): void {
    this.openMenuId.update((current) => (current === id ? null : id));
  }

  protected isActive(path: string): boolean {
    this.url();
    return this.router.isActive(path, {
      paths: 'subset',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }

  protected closeAll(): void {
    this.openMenuId.set(null);
    this.mobileOpen.set(false);
  }

  protected onEscape(): void {
    if (this.openMenuId() === null && !this.mobileOpen()) {
      return;
    }
    this.host.nativeElement
      .querySelector<HTMLElement>('.pb-navbar__trigger[aria-expanded="true"]')
      ?.focus();
    this.closeAll();
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.openMenuId.set(null);
    }
  }

  protected onFocusOut(event: FocusEvent, id: string): void {
    const next = event.relatedTarget as Node | null;
    const item = event.currentTarget as HTMLElement;
    if (this.openMenuId() === id && next !== null && !item.contains(next)) {
      this.openMenuId.set(null);
    }
  }
}
