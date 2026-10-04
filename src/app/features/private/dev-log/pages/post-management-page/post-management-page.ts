import { Component, computed, DestroyRef, inject, linkedSignal, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { combineLatest, EMPTY, Observable, of, switchMap, tap } from 'rxjs';
import { AdBadge } from '../../../../../shared/private/components/ad-badge/ad-badge';
import { AdButton } from '../../../../../shared/private/components/ad-button/ad-button';
import { AdCard } from '../../../../../shared/private/components/ad-card/ad-card';
import { AdConfirmDialog } from '../../../../../shared/private/components/ad-confirm-dialog/ad-confirm-dialog';
import { AdIcon } from '../../../../../shared/private/components/ad-icon/ad-icon';
import { AdPageHeader } from '../../../../../shared/private/components/ad-page-header/ad-page-header';
import { AdTable } from '../../../../../shared/private/components/ad-table/ad-table';
import { AdTableCell, AdTableToolbarActions } from '../../../../../shared/private/components/ad-table/ad-table-templates';
import { AD_PAGE_SIZE_OPTIONS } from '../../../../../shared/private/constants/ad-pagination.constants';
import { AdColumnFilterValue } from '../../../../../shared/private/interfaces/ad-filter.interface';
import { AdRowKey, AdTableRowAction } from '../../../../../shared/private/interfaces/ad-table.interface';
import { AdToastService } from '../../../../../shared/private/services/ad-toast.service';
import { catchApiError } from '../../../../../shared/utils/catch-api-error';
import { formatDate } from '../../../../../shared/utils/format-date-time';
import { localized } from '../../../../../shared/utils/localized';
import { AD_NAVIGATION_TEXTS } from '../../../../../core/private/i18n/ad-navigation-texts';
import { LanguageService } from '../../../../../core/public/services/language.service';
import { ApiResponse } from '../../../../../core/models/api-response.interface';
import { PagedResult } from '../../../../../core/models/paged-result.interface';
import {
  DEVLOG_ENTRY_CONFIRMATIONS,
  DEVLOG_ENTRY_ROW_ACTION,
  DEVLOG_ENTRY_ROW_ACTION_ITEMS,
  DevLogEntryConfirmableAction,
} from '../../constants/entries/devlog-entry-actions.constants';
import {
  DEVLOG_ENTRY_EMPTY_FEEDBACK,
  DEVLOG_ENTRY_ERROR_HEADINGS,
  DEVLOG_ENTRY_SUCCESS_FEEDBACK,
} from '../../constants/entries/devlog-entry-feedback.constants';
import { DEVLOG_ENTRY_TABLE_COLUMNS, DEVLOG_ENTRY_TEXTS } from '../../constants/entries/devlog-entry-list.constants';
import { DevLogEntrySummary } from '../../interfaces/entries/devlog-entry.interface';
import { DevLogEntryService } from '../../services/entries/devlog-entry.service';
import { devLogEntryRowActions } from '../../utils/entries/devlog-entry-row-actions';

interface PendingConfirmation {
  readonly action: DevLogEntryConfirmableAction;
  readonly entry: DevLogEntrySummary;
}

@Component({
  selector: 'ad-post-management-page',
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
  ],
  templateUrl: './post-management-page.html',
  styleUrl: './post-management-page.scss',
})
export class PostManagementPage {
  private readonly entryService = inject(DevLogEntryService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toast = inject(AdToastService);
  private readonly router = inject(Router);

  private readonly language = inject(LanguageService).language;

  protected readonly nav = localized(AD_NAVIGATION_TEXTS);
  protected readonly texts = localized(DEVLOG_ENTRY_TEXTS);
  protected readonly columns = localized(DEVLOG_ENTRY_TABLE_COLUMNS);
  private readonly confirmations = localized(DEVLOG_ENTRY_CONFIRMATIONS);
  private readonly successFeedback = localized(DEVLOG_ENTRY_SUCCESS_FEEDBACK);
  private readonly errorHeadings = localized(DEVLOG_ENTRY_ERROR_HEADINGS);
  private readonly emptyFeedback = localized(DEVLOG_ENTRY_EMPTY_FEEDBACK);
  private readonly rowActionItems = localized(DEVLOG_ENTRY_ROW_ACTION_ITEMS);

  protected readonly rowActions = computed(() => {
    const items = this.rowActionItems();
    return (entry: DevLogEntrySummary) => devLogEntryRowActions(entry, items);
  });

  protected readonly search = signal('');
  protected readonly filters = signal<readonly AdColumnFilterValue[]>([]);
  protected readonly pageSize = signal(AD_PAGE_SIZE_OPTIONS[0]);

  protected readonly page = linkedSignal<readonly unknown[], number>({
    source: () => [this.search(), this.filters(), this.pageSize()],
    computation: () => 1,
  });

  private readonly reloadTick = signal(0);

  private readonly query = computed(() => ({
    search: this.search(),
    filters: this.filters(),
    pageNumber: this.page(),
    pageSize: this.pageSize(),
  }));

  private readonly result = toSignal(
    combineLatest([toObservable(this.query), toObservable(this.reloadTick), toObservable(this.language)]).pipe(
      switchMap(([query]) =>
        this.fetchLevel(this.entryService.list(query)).pipe(
          tap((result) => {
            if (result.totalRecords === 0) {
              const filtered = (query.search ?? '').trim() !== '' || (query.filters ?? []).length > 0;
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

  protected readonly rowKey = (row: DevLogEntrySummary): AdRowKey => row.id;

  protected readonly confirmOpen = signal(false);
  protected readonly pending = signal<PendingConfirmation | null>(null);

  protected readonly confirmation = computed(() => {
    const pending = this.pending();
    return pending ? this.confirmations()[pending.action] : null;
  });
  protected readonly confirmationMessage = computed(() => {
    const pending = this.pending();
    if (!pending) {
      return '';
    }
    if (pending.action === DEVLOG_ENTRY_ROW_ACTION.feature) {
      const current = this.rows().find((row) => row.isFeatured);
      const name = current ? this.entryName(current) : this.texts().noFeaturedYet;
      return this.confirmations()[pending.action].message(name);
    }
    return this.confirmations()[pending.action].message(this.entryName(pending.entry));
  });

  protected dateOf(row: DevLogEntrySummary): string {
    return formatDate(row.dateCreated, this.language());
  }

  protected openCreate(): void {
    this.router.navigateByUrl('/admin/dev-log/posts/new');
  }

  protected onRowAction({ row, key }: AdTableRowAction<DevLogEntrySummary>): void {
    if (key === DEVLOG_ENTRY_ROW_ACTION.edit) {
      this.router.navigateByUrl(`/admin/dev-log/posts/${row.id}/edit`);
      return;
    }

    if (key === DEVLOG_ENTRY_ROW_ACTION.feature && row.isFeatured) {
      const texts = this.texts();
      this.toast.info(texts.alreadyFeaturedHeading, texts.alreadyFeaturedMessage(this.entryName(row)));
      return;
    }

    if (key in this.confirmations()) {
      this.pending.set({ action: key as DevLogEntryConfirmableAction, entry: row });
      this.confirmOpen.set(true);
    }
  }

  protected confirmAction(): void {
    const pending = this.pending();
    if (!pending) {
      return;
    }

    const { action, entry } = pending;
    const operation =
      action === DEVLOG_ENTRY_ROW_ACTION.delete
        ? this.entryService.delete(entry.id)
        : action === DEVLOG_ENTRY_ROW_ACTION.feature
          ? this.entryService.setFeatured(entry.id)
          : this.entryService.changeStatus(entry.id, action === DEVLOG_ENTRY_ROW_ACTION.activate);

    this.pending.set(null);
    this.run(operation).subscribe((response) => {
      if (response.isSuccess) {
        const success = this.successFeedback()[action];
        this.toast.success(success.heading, success.message(this.entryName(entry)));
        this.refresh();
      } else {
        this.toast.error(this.errorHeadings()[action], response.message ?? '');
      }
    });
  }

  private entryName(entry: Pick<DevLogEntrySummary, 'titleEs' | 'titleEn'>): string {
    return this.language() === 'en' ? entry.titleEn : entry.titleEs;
  }

  private refresh(): void {
    this.reloadTick.update((tick) => tick + 1);
  }

  private fetchLevel(
    request: Observable<ApiResponse<PagedResult<DevLogEntrySummary>>>,
  ): Observable<PagedResult<DevLogEntrySummary>> {
    return this.run(request).pipe(
      switchMap((response) => {
        if (!response.isSuccess || !response.data) {
          this.toast.error(this.errorHeadings().list, response.message ?? '');
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
