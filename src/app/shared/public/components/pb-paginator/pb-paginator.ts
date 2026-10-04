import { booleanAttribute, Component, computed, inject, input, model } from '@angular/core';
import { LanguageService } from '../../../../core/public/services/language.service';
import { Icon } from '../../../components/icon/icon';

@Component({
  selector: 'pb-paginator',
  imports: [Icon],
  templateUrl: './pb-paginator.html',
  styleUrl: './pb-paginator.scss',
})
export class PbPaginator {
  readonly index = model(0);
  readonly total = input.required<number>();
  readonly onMedia = input(false, { transform: booleanAttribute });

  private readonly t = inject(LanguageService).t;

  protected readonly texts = computed(() => this.t().paginator);
  protected readonly isFirst = computed(() => this.index() <= 0);
  protected readonly isLast = computed(() => this.index() >= this.total() - 1);

  protected previous(): void {
    if (!this.isFirst()) {
      this.index.update((value) => value - 1);
    }
  }

  protected next(): void {
    if (!this.isLast()) {
      this.index.update((value) => value + 1);
    }
  }
}
