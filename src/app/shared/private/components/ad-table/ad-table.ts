import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  contentChild,
  contentChildren,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { localized } from '../../../utils/localized';
import { AD_PAGE_SIZE_OPTIONS } from '../../constants/ad-pagination.constants';
import { AD_COMMON_TEXTS, AD_TABLE_TEXTS } from '../../constants/ad-texts.constants';
import { AdColumnFilterValue } from '../../interfaces/ad-filter.interface';
import { AdMenuItem } from '../../interfaces/ad-menu.interface';
import { AdPaginationChange } from '../../interfaces/ad-pagination.interface';
import {
  AdRowKey,
  AdTableChildren,
  AdTableChildrenRequest,
  AdTableColumn,
  AdTableRowAction,
  AdTableSort,
} from '../../interfaces/ad-table.interface';
import { AdButton } from '../ad-button/ad-button';
import { AdCheckbox } from '../ad-checkbox/ad-checkbox';
import { AdColumnFilter } from '../ad-column-filter/ad-column-filter';
import { AdColumnOrder } from '../ad-column-order/ad-column-order';
import { AdDialog } from '../ad-dialog/ad-dialog';
import { AdIcon } from '../ad-icon/ad-icon';
import { AdMenu } from '../ad-menu/ad-menu';
import { AdPaginationBar } from '../ad-pagination-bar/ad-pagination-bar';
import { AdTableToolbar } from '../ad-table-toolbar/ad-table-toolbar';
import { AdTableActions, AdTableCell, AdTableToolbarActions } from './ad-table-templates';

@Component({
  selector: 'ad-table',
  imports: [
    NgTemplateOutlet,
    AdButton,
    AdCheckbox,
    AdColumnFilter,
    AdColumnOrder,
    AdDialog,
    AdIcon,
    AdMenu,
    AdPaginationBar,
    AdTableToolbar,
  ],
  templateUrl: './ad-table.html',
  styleUrl: './ad-table.scss',
})
export class AdTable<T> {
  readonly caption = input.required<string>();
  readonly columns = input.required<readonly AdTableColumn<T>[]>();
  readonly rows = input.required<readonly T[]>();
  readonly rowKey = input.required<(row: T) => AdRowKey>();
  readonly totalRecords = input.required<number>();
  readonly selectable = input(false, { transform: booleanAttribute });
  readonly emptyText = input<string>();
  readonly pageSizeOptions = input<readonly number[]>(AD_PAGE_SIZE_OPTIONS);

  readonly searchable = input(false, { transform: booleanAttribute });
  readonly searchPlaceholder = input<string>();
  readonly childSearchPlaceholder = input<string>();
  readonly columnsConfigurable = input(false, { transform: booleanAttribute });
  readonly clearFiltersLabel = input<string>();

  readonly rowActions = input<((row: T) => readonly AdMenuItem[]) | null>(null);
  readonly rowActionsLabel = input<string>();

  readonly hasChildren = input<((row: T) => boolean) | null>(null);
  readonly children = input<ReadonlyMap<AdRowKey, AdTableChildren<T>>>(new Map());
  readonly childCaption = input<string>();
  readonly loadingText = input<string>();

  readonly page = model(1);
  readonly pageSize = model(AD_PAGE_SIZE_OPTIONS[0]);
  readonly search = model('');
  readonly columnOrder = model<readonly string[]>([]);
  readonly filters = model<readonly AdColumnFilterValue[]>([]);
  readonly selection = model<readonly AdRowKey[]>([]);
  readonly sort = model<AdTableSort | null>(null);
  readonly expanded = model<readonly AdRowKey[]>([]);

  readonly rowAction = output<AdTableRowAction<T>>();
  readonly childrenRequested = output<AdTableChildrenRequest<T>>();

  private readonly cells = contentChildren(AdTableCell);
  protected readonly actionsSlot = contentChild(AdTableActions);
  protected readonly toolbarSlot = contentChild(AdTableToolbarActions);

  protected readonly texts = localized(AD_TABLE_TEXTS);
  protected readonly commonTexts = localized(AD_COMMON_TEXTS);

  protected readonly columnsDialogOpen = signal(false);

  protected readonly emptyMessage = computed(() => this.emptyText() ?? this.texts().empty);
  protected readonly searchText = computed(
    () => this.searchPlaceholder() ?? this.texts().searchPlaceholder,
  );
  protected readonly childSearchText = computed(
    () => this.childSearchPlaceholder() ?? this.texts().searchPlaceholder,
  );
  protected readonly clearFiltersText = computed(
    () => this.clearFiltersLabel() ?? this.texts().clearFilters,
  );
  protected readonly rowActionsText = computed(
    () => this.rowActionsLabel() ?? this.texts().rowActions,
  );
  protected readonly childCaptionText = computed(
    () => this.childCaption() ?? this.texts().childCaption,
  );
  protected readonly loadingMessage = computed(() => this.loadingText() ?? this.texts().loading);

  private readonly cellTemplates = computed(
    () => new Map(this.cells().map((cell) => [cell.columnKey(), cell.template])),
  );
  private readonly selected = computed(() => new Set(this.selection()));
  private readonly expandedKeys = computed(() => new Set(this.expanded()));
  private readonly pageKeys = computed(() => this.rows().map((row) => this.rowKey()(row)));

  protected readonly orderedColumns = computed(() => {
    const order = this.columnOrder();
    const columns = this.columns();
    if (order.length === 0) {
      return columns;
    }
    const position = (column: AdTableColumn<T>): number => {
      const index = order.indexOf(column.key);
      return index === -1 ? order.length + columns.indexOf(column) : index;
    };
    return [...columns].sort((a, b) => position(a) - position(b));
  });

  protected readonly allSelected = computed(
    () => this.pageKeys().length > 0 && this.pageKeys().every((key) => this.selected().has(key)),
  );
  protected readonly someSelected = computed(
    () => !this.allSelected() && this.pageKeys().some((key) => this.selected().has(key)),
  );
  protected readonly hierarchical = computed(() => this.hasChildren() !== null);
  protected readonly hasRowActions = computed(() => this.rowActions() !== null);
  protected readonly showToolbar = computed(
    () =>
      this.searchable() ||
      this.columnsConfigurable() ||
      this.toolbarSlot() !== undefined ||
      this.filters().length > 0,
  );

  protected columnCount(depth: number): number {
    return (
      this.columns().length +
      (this.selectable() && depth === 0 ? 1 : 0) +
      (this.actionsSlot() ? 1 : 0) +
      (this.hierarchical() ? 1 : 0) +
      (this.hasRowActions() ? 1 : 0)
    );
  }

  protected cellTemplate(column: AdTableColumn<T>) {
    return this.cellTemplates().get(column.key) ?? null;
  }

  protected display(row: T, column: AdTableColumn<T>): string {
    const value = column.value ? column.value(row) : (row as Record<string, unknown>)[column.key];
    return value === null || value === undefined ? '' : String(value);
  }

  protected isSelected(row: T): boolean {
    return this.selected().has(this.rowKey()(row));
  }

  protected actionsOf(row: T): readonly AdMenuItem[] {
    return this.rowActions()?.(row) ?? [];
  }

  protected isExpandable(row: T): boolean {
    return this.hasChildren()?.(row) ?? false;
  }

  protected isExpanded(row: T): boolean {
    return this.expandedKeys().has(this.rowKey()(row));
  }

  protected childrenOf(row: T): AdTableChildren<T> | null {
    return this.children().get(this.rowKey()(row)) ?? null;
  }

  protected toggleExpanded(row: T): void {
    const key = this.rowKey()(row);
    const expanding = !this.expandedKeys().has(key);

    this.expanded.update((keys) =>
      expanding ? [...keys, key] : keys.filter((current) => current !== key),
    );

    if (expanding && !this.children().has(key)) {
      this.childrenRequested.emit({
        parent: row,
        page: 1,
        pageSize: this.pageSizeOptions()[0],
        search: '',
      });
    }
  }

  protected requestChildrenPage(
    parent: T,
    level: AdTableChildren<T>,
    change: AdPaginationChange,
  ): void {
    this.childrenRequested.emit({
      parent,
      page: change.page,
      pageSize: change.pageSize,
      search: level.search,
    });
  }

  protected searchChildren(parent: T, level: AdTableChildren<T>, search: string): void {
    this.childrenRequested.emit({ parent, page: 1, pageSize: level.pageSize, search });
  }

  protected filterField(column: AdTableColumn<T>): string {
    return column.filter?.field ?? column.key;
  }

  protected filterOf(column: AdTableColumn<T>): AdColumnFilterValue | null {
    const field = this.filterField(column);
    return this.filters().find((filter) => filter.field === field) ?? null;
  }

  protected applyFilter(column: AdTableColumn<T>, filter: AdColumnFilterValue | null): void {
    const field = this.filterField(column);
    this.filters.update((filters) => [
      ...filters.filter((current) => current.field !== field),
      ...(filter ? [filter] : []),
    ]);
    this.page.set(1);
  }

  protected clearFilters(): void {
    this.filters.set([]);
    this.page.set(1);
  }

  protected changeRootPagination(change: AdPaginationChange): void {
    this.page.set(change.page);
    this.pageSize.set(change.pageSize);
  }

  protected changeRootSearch(search: string): void {
    this.search.set(search);
    this.page.set(1);
  }

  protected toggleRow(row: T, checked: boolean): void {
    const key = this.rowKey()(row);
    this.selection.update((keys) =>
      checked
        ? [...keys.filter((current) => current !== key), key]
        : keys.filter((current) => current !== key),
    );
  }

  protected toggleAll(checked: boolean): void {
    const page = new Set(this.pageKeys());
    this.selection.update((keys) => {
      const others = keys.filter((key) => !page.has(key));
      return checked ? [...others, ...this.pageKeys()] : others;
    });
  }

  protected ariaSort(column: AdTableColumn<T>): 'ascending' | 'descending' | 'none' | null {
    if (!column.sortable) {
      return null;
    }
    const sort = this.sort();
    if (sort?.key !== column.key) {
      return 'none';
    }
    return sort.direction === 'asc' ? 'ascending' : 'descending';
  }

  protected toggleSort(column: AdTableColumn<T>): void {
    const sort = this.sort();
    if (sort?.key !== column.key) {
      this.sort.set({ key: column.key, direction: 'asc' });
    } else if (sort.direction === 'asc') {
      this.sort.set({ key: column.key, direction: 'desc' });
    } else {
      this.sort.set(null);
    }
  }
}
