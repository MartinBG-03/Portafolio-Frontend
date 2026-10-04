import { Component, computed, DestroyRef, inject, linkedSignal, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  combineLatest,
  EMPTY,
  map,
  Observable,
  of,
  skip,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { AdBadge } from '../../../../../shared/private/components/ad-badge/ad-badge';
import { AdButton } from '../../../../../shared/private/components/ad-button/ad-button';
import { AdConfirmDialog } from '../../../../../shared/private/components/ad-confirm-dialog/ad-confirm-dialog';
import { AdCard } from '../../../../../shared/private/components/ad-card/ad-card';
import { AdIcon } from '../../../../../shared/private/components/ad-icon/ad-icon';
import { AdPageHeader } from '../../../../../shared/private/components/ad-page-header/ad-page-header';
import { AdTable } from '../../../../../shared/private/components/ad-table/ad-table';
import {
  AdTableCell,
  AdTableToolbarActions,
} from '../../../../../shared/private/components/ad-table/ad-table-templates';
import { AD_PAGE_SIZE_OPTIONS } from '../../../../../shared/private/constants/ad-pagination.constants';
import { AdColumnFilterValue } from '../../../../../shared/private/interfaces/ad-filter.interface';
import {
  AdRowKey,
  AdTableChildren,
  AdTableChildrenRequest,
  AdTableRowAction,
} from '../../../../../shared/private/interfaces/ad-table.interface';
import { AdToastService } from '../../../../../shared/private/services/ad-toast.service';
import { catchApiError } from '../../../../../shared/utils/catch-api-error';
import { localized } from '../../../../../shared/utils/localized';
import { AD_NAVIGATION_TEXTS } from '../../../../../core/private/i18n/ad-navigation-texts';
import { LanguageService } from '../../../../../core/public/services/language.service';
import { ApiResponse } from '../../../../../core/models/api-response.interface';
import { PagedResult } from '../../../../../core/models/paged-result.interface';
import { CatalogFormDialog } from '../../components/catalogs/catalog-form-dialog/catalog-form-dialog';
import {
  CATALOG_CONFIRMATIONS,
  CATALOG_ROW_ACTION,
  CATALOG_ROW_ACTION_ITEMS,
  CatalogConfirmableAction,
} from '../../constants/catalogs/catalog-actions.constants';
import {
  CATALOG_PATH_SEPARATOR,
  CATALOG_TABLE_COLUMNS,
  CATALOG_TEXTS,
} from '../../constants/catalogs/catalog-list.constants';
import {
  CATALOG_EMPTY_FEEDBACK,
  CATALOG_ERROR_HEADINGS,
  CATALOG_SUCCESS_FEEDBACK,
} from '../../constants/catalogs/catalog-feedback.constants';
import { CreateCatalogRequest } from '../../interfaces/catalogs/catalog-request.interface';
import { Catalog } from '../../interfaces/catalogs/catalog.interface';
import { CatalogService } from '../../services/catalogs/catalog.service';
import { catalogName } from '../../utils/catalogs/catalog-name';
import { catalogRowActions } from '../../utils/catalogs/catalog-row-actions';

interface ChildLevelRequest {
  readonly page: number;
  readonly pageSize: number;
  readonly search: string;
}

interface PendingConfirmation {
  readonly action: CatalogConfirmableAction;
  readonly catalog: Catalog;
}

@Component({
  selector: 'ad-catalogs-page',
  imports: [
    AdPageHeader,
    AdCard,
    AdButton,
    AdIcon,
    AdTable,
    AdTableCell,
    AdTableToolbarActions,
    AdBadge,
    AdConfirmDialog,
    CatalogFormDialog,
  ],
  templateUrl: './catalogs-page.html',
  styleUrl: './catalogs-page.scss',
})
export class CatalogsPage {
  private readonly catalogService = inject(CatalogService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toast = inject(AdToastService);

  private readonly language = inject(LanguageService).language;

  protected readonly nav = localized(AD_NAVIGATION_TEXTS);
  protected readonly texts = localized(CATALOG_TEXTS);
  protected readonly columns = localized(CATALOG_TABLE_COLUMNS);
  private readonly confirmations = localized(CATALOG_CONFIRMATIONS);
  private readonly successFeedback = localized(CATALOG_SUCCESS_FEEDBACK);
  private readonly errorHeadings = localized(CATALOG_ERROR_HEADINGS);
  private readonly emptyFeedback = localized(CATALOG_EMPTY_FEEDBACK);
  private readonly rowActionItems = localized(CATALOG_ROW_ACTION_ITEMS);

  protected readonly rowActions = computed(() => {
    const items = this.rowActionItems();
    return (catalog: Catalog) => catalogRowActions(catalog, items);
  });

  protected readonly search = signal('');
  protected readonly filters = signal<readonly AdColumnFilterValue[]>([]);
  protected readonly pageSize = signal(AD_PAGE_SIZE_OPTIONS[0]);

  protected readonly page = linkedSignal<readonly unknown[], number>({
    source: () => [this.search(), this.filters(), this.pageSize()],
    computation: () => 1,
  });

  private readonly reloadTick = signal(0);

  private readonly rootQuery = computed(() => ({
    search: this.search(),
    filters: this.filters(),
    pageNumber: this.page(),
    pageSize: this.pageSize(),
  }));

  private readonly result = toSignal(
    combineLatest([
      toObservable(this.rootQuery),
      toObservable(this.reloadTick),
      toObservable(this.language),
    ]).pipe(
      switchMap(([query]) =>
        this.fetchLevel(this.catalogService.list(query), this.errorHeadings().list).pipe(
          tap((result) => {
            if (result.totalRecords === 0) {
              const filtered = query.search.trim() !== '' || query.filters.length > 0;
              const feedback = this.emptyFeedback();
              const empty = filtered ? feedback.noMatches : feedback.noData;
              this.toast.info(empty.heading, empty.message);
            }
          }),
        ),
      ),
    ),
    { initialValue: null },
  );

  protected readonly rows = computed(() => this.result()?.items ?? []);
  protected readonly totalRecords = computed(() => this.result()?.totalRecords ?? 0);

  private readonly childRequests = new Map<number, ChildLevelRequest>();
  private readonly childSubscriptions = new Map<number, Subscription>();

  protected readonly children = signal<ReadonlyMap<AdRowKey, AdTableChildren<Catalog>>>(new Map());

  protected readonly formOpen = signal(false);
  protected readonly editing = signal<Catalog | null>(null);
  protected readonly formParent = signal<Catalog | null>(null);
  protected readonly formPath = signal<readonly string[]>([]);
  private pathSubscription?: Subscription;

  protected readonly confirmOpen = signal(false);
  protected readonly pending = signal<PendingConfirmation | null>(null);

  protected readonly confirmation = computed(() => {
    const pending = this.pending();
    return pending ? this.confirmations()[pending.action] : null;
  });
  protected readonly confirmationMessage = computed(() => {
    const pending = this.pending();
    return pending
      ? this.confirmations()[pending.action].message(catalogName(pending.catalog, this.language()))
      : '';
  });

  protected readonly rowKey = (row: Catalog): AdRowKey => row.id;
  protected readonly hasChildren = (row: Catalog): boolean => row.status || row.childrenCount > 0;

  constructor() {
    toObservable(this.language)
      .pipe(skip(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.childRequests.forEach((_, parentId) => this.fetchChildren(parentId)));

    this.destroyRef.onDestroy(() => {
      this.childSubscriptions.forEach((subscription) => subscription.unsubscribe());
      this.pathSubscription?.unsubscribe();
    });
  }

  protected loadChildren({
    parent,
    page,
    pageSize,
    search,
  }: AdTableChildrenRequest<Catalog>): void {
    this.childRequests.set(parent.id, { page, pageSize, search });
    this.fetchChildren(parent.id);
  }

  protected openCreate(parent: Catalog | null): void {
    this.openForm(null, parent);
  }

  protected onRowAction({ row, key, parent }: AdTableRowAction<Catalog>): void {
    if (key === CATALOG_ROW_ACTION.edit) {
      this.openForm(row, parent);
      return;
    }

    if (key in this.confirmations()) {
      this.pending.set({ action: key as CatalogConfirmableAction, catalog: row });
      this.confirmOpen.set(true);
    }
  }

  protected save(request: CreateCatalogRequest): void {
    const editing = this.editing();
    const kind = editing ? 'update' : 'create';
    const operation: Observable<ApiResponse<unknown>> = editing
      ? this.catalogService.update(editing.id, request)
      : this.catalogService.create(request);

    this.run(operation).subscribe((response) => {
      if (response.isSuccess) {
        const success = this.successFeedback()[kind];
        this.formOpen.set(false);
        this.toast.success(success.heading, success.message(this.savedName(request)));
        this.refresh();
      } else {
        this.toast.error(this.errorHeadings()[kind], response.message ?? '');
      }
    });
  }

  protected confirmAction(): void {
    const pending = this.pending();
    if (!pending) {
      return;
    }

    const { action, catalog } = pending;
    const operation =
      action === CATALOG_ROW_ACTION.delete
        ? this.catalogService.delete(catalog.id)
        : this.catalogService.changeStatus(catalog.id, action === CATALOG_ROW_ACTION.activate);

    this.pending.set(null);
    this.run(operation).subscribe((response) => {
      if (response.isSuccess) {
        const success = this.successFeedback()[action];
        this.toast.success(success.heading, success.message(catalogName(catalog, this.language())));
        this.refresh();
      } else {
        this.toast.error(this.errorHeadings()[action], response.message ?? '');
      }
    });
  }

  private savedName(request: CreateCatalogRequest): string {
    return this.language() === 'en' ? request.nameEn : request.nameEs;
  }

  private openForm(catalog: Catalog | null, parent: Catalog | null): void {
    this.editing.set(catalog);
    this.formParent.set(parent);
    this.loadFormPath(parent);
    this.formOpen.set(true);
  }

  private loadFormPath(parent: Catalog | null): void {
    this.pathSubscription?.unsubscribe();
    this.formPath.set(parent ? [catalogName(parent, this.language())] : []);
    if (!parent) {
      return;
    }

    this.pathSubscription = this.catalogService
      .getTree()
      .pipe(
        map((response) => response.data?.find((node) => node.id === parent.id)),
        catchError(() => of(undefined)),
      )
      .subscribe((node) => {
        if (node) {
          const path = this.language() === 'en' ? node.namePathEn : node.namePathEs;
          this.formPath.set(path.split(CATALOG_PATH_SEPARATOR));
        }
      });
  }

  private refresh(): void {
    this.reloadTick.update((tick) => tick + 1);
    this.childRequests.forEach((_, parentId) => this.fetchChildren(parentId));
  }

  private fetchChildren(parentId: number): void {
    const request = this.childRequests.get(parentId);
    if (!request) {
      return;
    }

    this.childSubscriptions.get(parentId)?.unsubscribe();
    this.childSubscriptions.set(
      parentId,
      this.fetchLevel(
        this.catalogService.list({
          parentId,
          search: request.search,
          pageNumber: request.page,
          pageSize: request.pageSize,
        }),
        this.errorHeadings().children,
      ).subscribe((level) =>
        this.children.update((current) =>
          new Map(current).set(parentId, {
            rows: level.items,
            page: level.pageNumber,
            pageSize: level.pageSize,
            totalRecords: level.totalRecords,
            search: request.search,
          }),
        ),
      ),
    );
  }

  private fetchLevel(
    request: Observable<ApiResponse<PagedResult<Catalog>>>,
    errorHeading: string,
  ): Observable<PagedResult<Catalog>> {
    return this.run(request).pipe(
      switchMap((response) => {
        if (!response.isSuccess || !response.data) {
          this.toast.error(errorHeading, response.message ?? '');
          return EMPTY;
        }
        return of(response.data);
      }),
    );
  }

  private run<T>(request: Observable<ApiResponse<T>>): Observable<ApiResponse<T>> {
    return request.pipe(
      catchApiError(this.texts().connectionError, this.language()),
      takeUntilDestroyed(this.destroyRef),
    );
  }
}
