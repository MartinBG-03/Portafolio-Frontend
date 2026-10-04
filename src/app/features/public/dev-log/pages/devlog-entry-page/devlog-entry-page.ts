import { DOCUMENT } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, switchMap } from 'rxjs';
import { LanguageService } from '../../../../../core/public/services/language.service';
import { ToastService } from '../../../../../core/public/services/toast.service';
import { PbButton } from '../../../../../shared/public/components/pb-button/pb-button';
import { PbEmptyState } from '../../../../../shared/public/components/pb-empty-state/pb-empty-state';
import { PbPageHeader } from '../../../../../shared/public/components/pb-page-header/pb-page-header';
import { PbRichText } from '../../../../../shared/public/components/pb-rich-text/pb-rich-text';
import { BreadcrumbItem } from '../../../../../shared/public/interfaces/breadcrumb-item.interface';
import {
  PbDevLogTitleCardShareResult,
  PbDevlogTitleCard,
} from '../../components/pb-devlog-title-card/pb-devlog-title-card';
import { PbDevlogResources } from '../../components/pb-devlog-resources/pb-devlog-resources';
import { DevLogCategoryService } from '../../services/devlog-category.service';
import { DevLogEntryPublicService } from '../../services/devlog-entry-public.service';

@Component({
  selector: 'pb-devlog-entry-page',
  imports: [PbPageHeader, PbEmptyState, PbButton, PbRichText, PbDevlogTitleCard, PbDevlogResources],
  templateUrl: './devlog-entry-page.html',
  styleUrl: './devlog-entry-page.scss',
})
export class DevlogEntryPage {
  private readonly languageService = inject(LanguageService);
  private readonly toast = inject(ToastService);
  private readonly origin = inject(DOCUMENT).location.origin;
  private readonly categoryService = inject(DevLogCategoryService);
  private readonly entryService = inject(DevLogEntryPublicService);

  protected readonly t = this.languageService.t;

  private readonly slug$ = inject(ActivatedRoute).paramMap.pipe(map((params) => params.get('slug') ?? ''));

  private readonly entry = toSignal(
    combineLatest([this.slug$, this.categoryService.list()]).pipe(
      switchMap(([slug, categories]) => this.entryService.getBySlug(slug, categories)),
    ),
    { initialValue: undefined },
  );

  protected readonly view = computed(() => {
    const entry = this.entry();
    if (!entry) {
      return null;
    }
    const language = this.languageService.language();
    return {
      title: entry.title[language],
      description: entry.description[language],
      body: entry.body[language],
      date: entry.date,
      coverUrl: entry.coverUrl,
      titleDesign: entry.titleDesign,
      shareUrl: `${this.origin}/dev-log/${entry.slug[language]}`,
      categories: entry.categories.map((category) => ({ id: category.id, label: category.name[language] })),
      resources: entry.resources,
    };
  });

  protected readonly breadcrumbs = computed<readonly BreadcrumbItem[]>(() => {
    const trail: BreadcrumbItem[] = [
      { label: this.t().nav.home, path: '/' },
      { label: this.t().nav.devLog, path: '/dev-log' },
    ];
    const view = this.view();
    return view ? [...trail, { label: view.title }] : trail;
  });

  protected onShared(result: PbDevLogTitleCardShareResult): void {
    const texts = this.t().devLog.share;
    if (result === 'copied') {
      this.toast.show({ variant: 'success', title: texts.copied, description: texts.copiedDescription });
    } else if (result === 'failed') {
      this.toast.show({ variant: 'error', title: texts.failed, description: texts.failedDescription });
    }
  }
}
