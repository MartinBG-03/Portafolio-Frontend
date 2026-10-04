import { Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../../../../core/public/services/language.service';
import { formatDate } from '../../../../../core/public/utils/format-date';
import { PbButton } from '../../../../../shared/public/components/pb-button/pb-button';
import { PbChip } from '../../../../../shared/public/components/pb-chip/pb-chip';
import { PbMediaCard } from '../../../../../shared/public/components/pb-media-card/pb-media-card';
import { PbSpacedHeading } from '../../../../../shared/public/components/pb-spaced-heading/pb-spaced-heading';
import { ACADEMY_DOCUMENTS } from '../../../academy/data/academy.data';
import { PROJECTS } from '../../../projects/data/projects.data';
import { FEED_FILTERS, FeedFilter, FeedItem } from '../../models/feed-item.model';

const COLLAPSED_ITEMS = 3;

@Component({
  selector: 'pb-home-latest',
  imports: [PbSpacedHeading, PbChip, PbMediaCard, PbButton],
  templateUrl: './pb-home-latest.html',
  styleUrl: './pb-home-latest.scss',
})
export class PbHomeLatest {
  private readonly languageService = inject(LanguageService);

  protected readonly t = this.languageService.t;

  protected readonly filter = signal<FeedFilter>('all');
  protected readonly expanded = signal(false);

  protected readonly filterOptions = computed(() => {
    const latest = this.t().home.latest;
    const labels: Record<FeedFilter, string> = {
      all: latest.all,
      project: latest.project,
      academy: latest.academy,
    };

    return FEED_FILTERS.map((value) => ({ value, label: labels[value] }));
  });

  private readonly items = computed<readonly FeedItem[]>(() => {
    const language = this.languageService.language();

    const projects = PROJECTS.map<FeedItem>((project) => ({
      id: project.id,
      kind: 'project',
      date: project.date,
      title: project.title[language],
      tone: project.category,
      path: '/projects',
      queryParams: { category: project.category },
    }));
    const documents = ACADEMY_DOCUMENTS.map<FeedItem>((document) => ({
      id: document.id,
      kind: 'academy',
      date: document.date,
      title: document.title[language],
      tone: 'automation',
      path: '/academy',
    }));

    return [...projects, ...documents].sort((a, b) => b.date.localeCompare(a.date));
  });

  private readonly filtered = computed(() => {
    const selected = this.filter();
    return this.items().filter((item) => selected === 'all' || item.kind === selected);
  });

  protected readonly canExpand = computed(() => this.filtered().length > COLLAPSED_ITEMS);

  protected readonly cards = computed(() => {
    const language = this.languageService.language();
    const latest = this.t().home.latest;
    const kinds: Record<FeedItem['kind'], string> = {
      project: latest.kindProject,
      academy: latest.kindAcademy,
    };
    const visible = this.expanded() ? this.filtered() : this.filtered().slice(0, COLLAPSED_ITEMS);

    return visible.map((item) => ({
      ...item,
      kindLabel: kinds[item.kind],
      dateLabel: formatDate(item.date, language),
    }));
  });

  protected select(value: FeedFilter): void {
    this.filter.set(value);
    this.expanded.set(false);
  }

  protected toggle(): void {
    this.expanded.update((expanded) => !expanded);
  }
}
