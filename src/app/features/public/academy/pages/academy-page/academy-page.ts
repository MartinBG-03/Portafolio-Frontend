import { Component, computed, inject } from '@angular/core';
import { LanguageService } from '../../../../../core/public/services/language.service';
import { PbEmptyState } from '../../../../../shared/public/components/pb-empty-state/pb-empty-state';
import { PbPageHeader } from '../../../../../shared/public/components/pb-page-header/pb-page-header';
import { BreadcrumbItem } from '../../../../../shared/public/interfaces/breadcrumb-item.interface';

@Component({
  selector: 'pb-academy-page',
  imports: [PbPageHeader, PbEmptyState],
  templateUrl: './academy-page.html',
  styleUrl: './academy-page.scss',
})
export class AcademyPage {
  protected readonly t = inject(LanguageService).t;

  protected readonly breadcrumbs = computed<readonly BreadcrumbItem[]>(() => [
    { label: this.t().nav.home, path: '/' },
    { label: this.t().nav.academy },
  ]);
}
