import { effect, inject, Injectable, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { siteConfig } from '../../config/site.config';
import { AD_NAVIGATION_TEXTS, AD_ROUTE_TITLE_PREFIX } from '../../private/i18n/ad-navigation-texts';
import { LanguageService } from './language.service';

@Injectable({ providedIn: 'root' })
export class PageTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly languageService = inject(LanguageService);
  private readonly routeTitle = signal<string | null>(null);

  constructor() {
    super();
    effect(() => {
      const key = this.routeTitle();
      if (key === null) {
        return;
      }
      const isAdmin = key.startsWith(AD_ROUTE_TITLE_PREFIX);
      const labels = (
        isAdmin
          ? AD_NAVIGATION_TEXTS[this.languageService.language()].nav
          : this.languageService.t().nav
      ) as Record<string, string>;
      const name = isAdmin ? key.slice(AD_ROUTE_TITLE_PREFIX.length) : key;
      this.title.setTitle(`${labels[name] ?? name} | ${siteConfig.name}`);
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.routeTitle.set(this.buildTitle(snapshot) ?? null);
  }
}
