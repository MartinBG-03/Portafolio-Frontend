import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../../../core/public/services/language.service';
import { Icon } from '../../../../../shared/components/icon/icon';
import { PbButton } from '../../../../../shared/public/components/pb-button/pb-button';
import { PbCircleArrow } from '../../../../../shared/public/components/pb-circle-arrow/pb-circle-arrow';
import { PROJECTS } from '../../../projects/data/projects.data';
import { toProjectView } from '../../../projects/models/project-view.model';

const LISTED_PROJECTS = 2;

@Component({
  selector: 'pb-home-projects',
  imports: [RouterLink, Icon, PbButton, PbCircleArrow],
  templateUrl: './pb-home-projects.html',
  styleUrl: './pb-home-projects.scss',
})
export class PbHomeProjects {
  private readonly languageService = inject(LanguageService);

  protected readonly t = this.languageService.t;

  private readonly views = computed(() => {
    const language = this.languageService.language();
    const categories = this.t().projects.categories;

    return PROJECTS.map((project) => toProjectView(project, language, categories));
  });

  protected readonly featured = computed(() => this.views()[0]);
  protected readonly listed = computed(() => this.views().slice(1, 1 + LISTED_PROJECTS));
}
