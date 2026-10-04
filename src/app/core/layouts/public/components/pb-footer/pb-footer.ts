import { Component, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { siteConfig } from '../../../../config/site.config';
import { FOOTER_ROUTE_PATHS, SiteFooterService } from '../../../../public/services/site-footer.service';
import { LanguageService } from '../../../../public/services/language.service';
import { GameThemeService } from '../../../../public/services/game-theme.service';
import { Icon } from '../../../../../shared/components/icon/icon';
import { IconName, toIconName } from '../../../../../shared/components/icon/icon-registry';
import { PbLogo } from '../../../../../shared/public/components/pb-logo/pb-logo';
import { PbRunnerGame } from '../pb-runner-game/pb-runner-game';

const MAIL_CODE = 'mail';

interface FooterNavLink {
  readonly path: string;
  readonly label: string;
}

interface FooterSocial {
  readonly icon: IconName;
  readonly href: string;
  readonly label: string;
}

@Component({
  selector: 'pb-footer',
  imports: [RouterLink, Icon, PbLogo, PbRunnerGame],
  templateUrl: './pb-footer.html',
  styleUrl: './pb-footer.scss',
})
export class PbFooter {
  private readonly languageService = inject(LanguageService);
  private readonly gameThemeService = inject(GameThemeService);

  protected readonly t = this.languageService.t;
  protected readonly siteName = siteConfig.name;
  protected readonly year = new Date().getFullYear();
  protected readonly gameTheme = this.gameThemeService.theme;

  private readonly footer = inject(SiteFooterService).data;

  protected readonly headline = computed(() => {
    const theme = this.footer().game.themes.find((candidate) => candidate.theme === this.gameTheme());
    if (!theme) {
      return '';
    }
    return this.languageService.language() === 'en' ? theme.headlineEn : theme.headlineEs;
  });

  constructor() {
    effect(() => {
      const themes = this.footer().game.themes;
      if (themes.length === 0) {
        return;
      }
      if (!themes.some((theme) => theme.theme === this.gameTheme())) {
        this.gameThemeService.set(themes[0].theme);
      }
    });
  }

  protected readonly navLinks = computed<readonly FooterNavLink[]>(() => {
    const t = this.t();
    return this.footer().links.map((link) => ({
      path: FOOTER_ROUTE_PATHS[link.routeKey],
      label: t.nav[link.routeKey],
    }));
  });

  protected readonly socials = computed<readonly FooterSocial[]>(() => {
    const language = this.languageService.language();
    return this.footer()
      .socials.map((social) => {
        const icon = toIconName(social.code);
        if (!icon) {
          return null;
        }
        const isEmail = social.code.toLowerCase() === MAIL_CODE;
        return {
          icon,
          href: isEmail ? `mailto:${social.value}` : social.value,
          label: language === 'en' ? social.nameEn : social.nameEs,
        };
      })
      .filter((social): social is FooterSocial => social !== null);
  });

  protected readonly gameVisible = computed(() => this.footer().game.isVisible);
}
