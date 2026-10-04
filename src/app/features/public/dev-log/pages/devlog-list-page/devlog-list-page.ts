import { Component, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { LanguageService } from '../../../../../core/public/services/language.service';
import { PbEmptyState } from '../../../../../shared/public/components/pb-empty-state/pb-empty-state';
import { PbPageHeader } from '../../../../../shared/public/components/pb-page-header/pb-page-header';
import { PbPaginator } from '../../../../../shared/public/components/pb-paginator/pb-paginator';
import { PbSkeleton } from '../../../../../shared/public/components/pb-skeleton/pb-skeleton';
import { BreadcrumbItem } from '../../../../../shared/public/interfaces/breadcrumb-item.interface';
import { PbDevlogCard } from '../../components/pb-devlog-card/pb-devlog-card';
import { PbDevlogFilters, PbDevlogFilterCategory } from '../../components/pb-devlog-filters/pb-devlog-filters';
import { PbDevlogHero } from '../../components/pb-devlog-hero/pb-devlog-hero';
import { DevLogCategoryService } from '../../services/devlog-category.service';
import { DevLogEntryPublicService, DevLogEntrySummaryView } from '../../services/devlog-entry-public.service';

const PREVIOUS_PAGE_SIZE = 6;
const SEARCH_DEBOUNCE_MS = 300;

const EMPTY_PAGE = {
  items: [] as readonly DevLogEntrySummaryView[],
  pageNumber: 1,
  pageSize: PREVIOUS_PAGE_SIZE,
  totalRecords: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

@Component({
  selector: 'pb-devlog-list-page',
  imports: [PbPageHeader, PbEmptyState, PbDevlogHero, PbDevlogFilters, PbDevlogCard, PbPaginator, PbSkeleton],
  templateUrl: './devlog-list-page.html',
  styleUrl: './devlog-list-page.scss',
})
export class DevlogListPage {
  private readonly languageService = inject(LanguageService);
  private readonly categoryService = inject(DevLogCategoryService);
  private readonly entryService = inject(DevLogEntryPublicService);

  protected readonly t = this.languageService.t;

  protected readonly breadcrumbs = computed<readonly BreadcrumbItem[]>(() => [
    { label: this.t().nav.home, path: '/' },
    { label: this.t().nav.devLog },
  ]);

  private readonly categories = toSignal(this.categoryService.list(), { initialValue: [] });

  protected readonly filterCategories = computed<readonly PbDevlogFilterCategory[]>(() => {
    const language = this.languageService.language();
    return this.categories().map((category) => ({ id: category.id, label: category.name[language] }));
  });

  protected readonly selectedCategoryId = signal<number | null>(null);
  protected readonly searchTerm = signal('');
  protected readonly previousPage = signal(0);

  protected readonly skeletonCards = [0, 1, 2, 3, 4, 5];

  private readonly featuredLoaded = signal(false);
  private readonly previousLoaded = signal(false);

  protected readonly loading = computed(() => !this.featuredLoaded() || !this.previousLoaded());

  private readonly featuredEntryRaw = toSignal(
    this.entryService.getFeatured().pipe(tap(() => this.featuredLoaded.set(true))),
    { initialValue: null },
  );

  private readonly previousResult = toSignal(
    combineLatest([
      toObservable(this.selectedCategoryId),
      toObservable(this.searchTerm).pipe(debounceTime(SEARCH_DEBOUNCE_MS), distinctUntilChanged()),
      toObservable(this.previousPage),
    ]).pipe(
      switchMap(([catalogId, search, pageIndex]) =>
        this.entryService.list({
          catalogId: catalogId ?? undefined,
          search: search.trim() || undefined,
          pageNumber: pageIndex + 1,
          pageSize: PREVIOUS_PAGE_SIZE,
        }),
      ),
      tap(() => this.previousLoaded.set(true)),
    ),
    { initialValue: EMPTY_PAGE },
  );

  protected readonly featuredEntry = computed(() => {
    const entry = this.featuredEntryRaw();
    if (!entry) {
      return null;
    }
    const language = this.languageService.language();
    return {
      id: entry.id,
      path: `/dev-log/${entry.slug[language]}`,
      title: entry.title[language],
      description: entry.description[language],
      date: entry.date,
      coverUrl: entry.coverUrl,
    };
  });

  protected readonly previousEntries = computed(() => {
    const language = this.languageService.language();
    return this.previousResult()
      .items.map((entry) => ({
        id: entry.id,
        path: `/dev-log/${entry.slug[language]}`,
        title: entry.title[language],
        description: entry.description[language],
        date: entry.date,
        coverUrl: entry.coverUrl,
        category: entry.categories[0]?.name[language] ?? null,
      }));
  });

  protected readonly previousTotalRecords = computed(() => this.previousResult().totalRecords);
  protected readonly previousTotalPages = computed(() => Math.max(1, this.previousResult().totalPages));

  constructor() {
    effect(() => {
      this.selectedCategoryId();
      this.searchTerm();
      this.previousPage.set(0);
    });
  }
}
