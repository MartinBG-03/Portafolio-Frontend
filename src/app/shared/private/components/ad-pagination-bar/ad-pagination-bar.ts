import { Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { localized } from '../../../utils/localized';
import { AD_PAGE_SIZE_OPTIONS } from '../../constants/ad-pagination.constants';
import { AD_PAGINATION_TEXTS } from '../../constants/ad-texts.constants';
import { AdOption, AdOptionValue } from '../../interfaces/ad-option.interface';
import { AdPaginationChange } from '../../interfaces/ad-pagination.interface';
import { AdIcon } from '../ad-icon/ad-icon';
import { AdIconButton } from '../ad-icon-button/ad-icon-button';
import { AdSelect } from '../ad-select/ad-select';

@Component({
  selector: 'ad-pagination-bar',
  imports: [FormsModule, AdIcon, AdIconButton, AdSelect],
  templateUrl: './ad-pagination-bar.html',
  styleUrl: './ad-pagination-bar.scss',
})
export class AdPaginationBar {
  readonly label = input<string>();
  readonly page = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly totalRecords = input.required<number>();
  readonly pageSizeOptions = input<readonly number[]>(AD_PAGE_SIZE_OPTIONS);

  readonly paginationChange = output<AdPaginationChange>();

  protected readonly texts = localized(AD_PAGINATION_TEXTS);

  protected readonly labelText = computed(() => this.label() ?? this.texts().label);
  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalRecords() / Math.max(1, this.pageSize()))),
  );
  protected readonly current = computed(() =>
    Math.min(Math.max(1, this.page()), this.totalPages()),
  );

  protected readonly summary = computed(() => {
    const total = this.totalRecords();
    const first = total === 0 ? 0 : (this.current() - 1) * this.pageSize() + 1;
    const last = Math.min(total, this.current() * this.pageSize());
    const range = first === last ? `${first}` : `${first}-${last}`;
    return this.texts().summary(range, total);
  });

  protected readonly sizeOptions = computed<readonly AdOption[]>(() =>
    this.pageSizeOptions().map((size) => ({ value: size, label: String(size) })),
  );

  protected go(page: number): void {
    const target = Math.min(Math.max(1, page), this.totalPages());
    if (target !== this.current()) {
      this.paginationChange.emit({ page: target, pageSize: this.pageSize() });
    }
  }

  protected changeSize(value: AdOptionValue | null): void {
    const size = Number(value);
    if (Number.isFinite(size) && size > 0 && size !== this.pageSize()) {
      this.paginationChange.emit({ page: 1, pageSize: size });
    }
  }
}
