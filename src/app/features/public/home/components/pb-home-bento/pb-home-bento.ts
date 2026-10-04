import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../../../core/public/services/language.service';
import { Icon } from '../../../../../shared/components/icon/icon';
import { IconName } from '../../../../../shared/components/icon/icon-registry';
import { PbChip } from '../../../../../shared/public/components/pb-chip/pb-chip';
import { PbCircleArrow } from '../../../../../shared/public/components/pb-circle-arrow/pb-circle-arrow';
import { PROJECTS } from '../../../projects/data/projects.data';
import { STACK } from '../../data/stack.data';

type ServiceTone = 'accent' | 'gray' | 'neutral' | 'soft';

interface BentoService {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly queryParams?: Readonly<Record<string, string>>;
  readonly tone: ServiceTone;
  readonly icon?: IconName;
}

@Component({
  selector: 'pb-home-bento',
  imports: [RouterLink, Icon, PbChip, PbCircleArrow],
  templateUrl: './pb-home-bento.html',
  styleUrl: './pb-home-bento.scss',
})
export class PbHomeBento {
  protected readonly t = inject(LanguageService).t;

  protected readonly projectCount = PROJECTS.length;
  protected readonly stack = STACK;
  protected readonly bars = [40, 75, 100, 60];

  protected readonly services = computed<readonly BentoService[]>(() => {
    const services = this.t().home.bento.services;

    return [
      {
        id: 'web',
        ...services.web,
        path: '/projects',
        queryParams: { category: 'web' },
        tone: 'accent',
      },
      {
        id: 'mobile',
        ...services.mobile,
        path: '/projects',
        queryParams: { category: 'mobile' },
        tone: 'gray',
      },
      {
        id: 'automation',
        ...services.automation,
        path: '/projects',
        queryParams: { category: 'automation' },
        tone: 'neutral',
      },
      { id: 'idea', ...services.idea, path: '/contact', tone: 'soft' },
    ];
  });
}
