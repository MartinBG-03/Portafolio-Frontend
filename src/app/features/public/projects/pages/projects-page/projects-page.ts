import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { LanguageService } from '../../../../../core/public/services/language.service';
import { PbChip } from '../../../../../shared/public/components/pb-chip/pb-chip';
import { PbEmptyState } from '../../../../../shared/public/components/pb-empty-state/pb-empty-state';
import { PbPageHeader } from '../../../../../shared/public/components/pb-page-header/pb-page-header';
import { BreadcrumbItem } from '../../../../../shared/public/interfaces/breadcrumb-item.interface';
import { PbProjectCard } from '../../components/pb-project-card/pb-project-card';
import { PROJECTS } from '../../data/projects.data';
import { PROJECT_FILTERS, ProjectFilter, parseProjectFilter } from '../../models/project.model';

@Component({
  selector: 'pb-projects-page',
  imports: [PbPageHeader, PbChip, PbEmptyState, PbProjectCard],
  templateUrl: './projects-page.html',
  styleUrl: './projects-page.scss',
})
export class ProjectsPage {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly languageService = inject(LanguageService);

  protected readonly t = this.languageService.t;

  protected readonly filter = toSignal(
    this.route.queryParamMap.pipe(map((params) => parseProjectFilter(params.get('category')))),
    { initialValue: parseProjectFilter(this.route.snapshot.queryParamMap.get('category')) },
  );

  protected readonly breadcrumbs = computed<readonly BreadcrumbItem[]>(() => [
    { label: this.t().nav.home, path: '/' },
    { label: this.t().nav.projects },
  ]);

  protected readonly filterOptions = computed(() => {
    const categories = this.t().projects.categories;
    return PROJECT_FILTERS.map((value) => ({ value, label: categories[value] }));
  });

  protected readonly cards = computed(() => {
    const language = this.languageService.language();
    const selected = this.filter();
    const categories = this.t().projects.categories;

    return PROJECTS.filter((project) => selected === 'all' || project.category === selected).map(
      (project) => ({
        id: project.id,
        category: project.category,
        categoryLabel: categories[project.category],
        title: project.title[language],
        description: project.description[language],
      }),
    );
  });

  protected select(value: ProjectFilter): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: value === 'all' ? null : value },
      queryParamsHandling: 'merge',
    });
  }
}
