import { Component, computed, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../../../../shared/components/icon/icon';
import { PbButton } from '../../../../../shared/public/components/pb-button/pb-button';
import { NavMenu } from '../../../../../shared/public/interfaces/main-nav-item.interface';

@Component({
  selector: 'pb-nav-mega-menu',
  imports: [RouterLink, Icon, PbButton],
  templateUrl: './pb-nav-mega-menu.html',
  styleUrl: './pb-nav-mega-menu.scss',
})
export class PbNavMegaMenu {
  readonly panelId = input.required<string>();
  readonly menu = input.required<NavMenu>();

  readonly navigated = output<void>();

  private readonly selectedId = signal<string | null>(null);

  protected readonly active = computed(() => {
    const categories = this.menu().categories;
    return categories.find((category) => category.id === this.selectedId()) ?? categories[0];
  });

  protected select(id: string): void {
    this.selectedId.set(id);
  }
}
