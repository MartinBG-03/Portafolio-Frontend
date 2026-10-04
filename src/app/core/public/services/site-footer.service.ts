import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { ApiResponse } from '../../models/api-response.interface';
import { FooterRouteKey, SiteFooterDto } from '../interfaces/site-footer.interface';

export const FOOTER_ROUTE_PATHS: Readonly<Record<FooterRouteKey, string>> = {
  home: '/',
  about: '/about',
  projects: '/projects',
  academy: '/academy',
  devLog: '/dev-log',
  designSystem: '/design-system',
  contact: '/contact',
};

const FALLBACK: SiteFooterDto = {
  links: [{ routeKey: 'about' }, { routeKey: 'projects' }, { routeKey: 'contact' }],
  socials: [
    {
      code: 'linkedin',
      nameEs: 'LinkedIn',
      nameEn: 'LinkedIn',
      value: 'https://linkedin.com/in/martin-bastidas-galvez',
    },
    { code: 'mail', nameEs: 'Correo electrónico', nameEn: 'Email', value: 'info@mbast.dev' },
  ],
  game: {
    isVisible: true,
    themes: [
      {
        theme: 'city',
        headlineEs: '¿Una pausa? Esquiva los bugs.',
        headlineEn: 'Need a break? Dodge the bugs.',
        instructionsEs: 'Espacio para saltar, flecha abajo para agacharte.',
        instructionsEn: 'Space to jump, down arrow to duck.',
        gameOverEs: 'Chocaste',
        gameOverEn: 'You crashed',
        retryEs: 'Toca o pulsa espacio para reintentar.',
        retryEn: 'Tap or press space to try again.',
      },
      {
        theme: 'forest',
        headlineEs: '¿Una pausa? Cruza el bosque encantado.',
        headlineEn: 'Need a break? Cross the enchanted forest.',
        instructionsEs: 'Espacio para saltar, flecha abajo para agacharte.',
        instructionsEn: 'Space to jump, down arrow to duck.',
        gameOverEs: 'Chocaste',
        gameOverEn: 'You crashed',
        retryEs: 'Toca o pulsa espacio para reintentar.',
        retryEn: 'Tap or press space to try again.',
      },
      {
        theme: 'construction',
        headlineEs: '¿Una pausa? Date una vuelta por la obra.',
        headlineEn: 'Need a break? Take a walk through the site.',
        instructionsEs: 'Espacio para saltar, flecha abajo para agacharte.',
        instructionsEn: 'Space to jump, down arrow to duck.',
        gameOverEs: 'Chocaste',
        gameOverEn: 'You crashed',
        retryEs: 'Toca o pulsa espacio para reintentar.',
        retryEn: 'Tap or press space to try again.',
      },
    ],
  },
};

@Injectable({ providedIn: 'root' })
export class SiteFooterService {
  private readonly http = inject(HttpClient);

  readonly data = toSignal(
    this.http.get<ApiResponse<SiteFooterDto>>('public/site-footer').pipe(
      map((response) => response.data ?? FALLBACK),
      catchError(() => of(FALLBACK)),
    ),
    { initialValue: FALLBACK },
  );
}
