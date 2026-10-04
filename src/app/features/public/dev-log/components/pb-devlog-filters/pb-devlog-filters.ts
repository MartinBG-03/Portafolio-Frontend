import { Component, computed, inject, input, model } from '@angular/core';
import { LanguageService } from '../../../../../core/public/services/language.service';
import { Icon } from '../../../../../shared/components/icon/icon';

export interface PbDevlogFilterCategory {
  readonly id: number;
  readonly label: string;
}

@Component({
  selector: 'pb-devlog-filters',
  imports: [Icon],
  templateUrl: './pb-devlog-filters.html',
  styleUrl: './pb-devlog-filters.scss',
})
export class PbDevlogFilters {
  private readonly languageService = inject(LanguageService);

  readonly categories = input<readonly PbDevlogFilterCategory[]>([]);
  readonly total = input(0);
  readonly selectedId = model<number | null>(null);
  readonly searchTerm = model('');

  protected readonly texts = computed(() => this.languageService.t().devLog.filters);

  protected selectAll(): void {
    this.selectedId.set(null);
  }

  protected select(id: number): void {
    this.selectedId.set(id);
  }

  protected onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }
}
