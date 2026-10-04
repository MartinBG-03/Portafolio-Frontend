import { Component, computed, inject } from '@angular/core';
import { LanguageService } from '../../../../../core/public/services/language.service';
import { Icon } from '../../../../../shared/components/icon/icon';
import { PbButton } from '../../../../../shared/public/components/pb-button/pb-button';
import { PbCarousel } from '../../../../../shared/public/components/pb-carousel/pb-carousel';
import { PbCarouselSlide } from '../../../../../shared/public/components/pb-carousel-slide/pb-carousel-slide';
import { PROJECTS } from '../../../projects/data/projects.data';
import { toProjectView } from '../../../projects/models/project-view.model';

const FEATURED_PROJECTS = 3;

@Component({
  selector: 'pb-home-hero',
  imports: [PbCarousel, PbCarouselSlide, PbButton, Icon],
  templateUrl: './pb-home-hero.html',
  styleUrl: './pb-home-hero.scss',
})
export class PbHomeHero {
  private readonly languageService = inject(LanguageService);

  protected readonly t = this.languageService.t;
  protected readonly cvHref = computed(() => `cv/cv-${this.languageService.language()}.pdf`);

  protected readonly projects = computed(() => {
    const language = this.languageService.language();
    const categories = this.t().projects.categories;

    return PROJECTS.slice(0, FEATURED_PROJECTS).map((project) =>
      toProjectView(project, language, categories),
    );
  });
}
