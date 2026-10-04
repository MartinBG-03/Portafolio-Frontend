import { Component, computed, inject } from '@angular/core';
import { LanguageService } from '../../../../../core/public/services/language.service';
import { Icon } from '../../../../../shared/components/icon/icon';
import { IconName } from '../../../../../shared/components/icon/icon-registry';
import { PROJECTS } from '../../../projects/data/projects.data';

interface WhyPoint {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon?: IconName;
}

@Component({
  selector: 'pb-home-why',
  imports: [Icon],
  templateUrl: './pb-home-why.html',
  styleUrl: './pb-home-why.scss',
})
export class PbHomeWhy {
  protected readonly t = inject(LanguageService).t;

  protected readonly projectCount = PROJECTS.length;

  protected readonly points = computed<readonly WhyPoint[]>(() => {
    const why = this.t().home.why;

    return [
      { id: 'user-focus', ...why.userFocus, icon: 'user' },
      { id: 'clarity', ...why.clarity },
      { id: 'stages', ...why.stages, icon: 'check-circle' },
    ];
  });
}
