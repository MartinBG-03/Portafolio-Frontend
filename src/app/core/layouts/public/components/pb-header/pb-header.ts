import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { siteConfig } from '../../../../config/site.config';
import { LanguageService } from '../../../../public/services/language.service';
import { Icon } from '../../../../../shared/components/icon/icon';
import { PbLanguageSwitch } from '../../../../../shared/public/components/pb-language-switch/pb-language-switch';
import { PbLogo } from '../../../../../shared/public/components/pb-logo/pb-logo';
import { PbThemeToggle } from '../../../../../shared/public/components/pb-theme-toggle/pb-theme-toggle';
import { PbNavbar } from '../pb-navbar/pb-navbar';
import { buildMainNav } from './main-nav';

@Component({
  selector: 'pb-header',
  imports: [RouterLink, Icon, PbLogo, PbNavbar, PbLanguageSwitch, PbThemeToggle],
  templateUrl: './pb-header.html',
  styleUrl: './pb-header.scss',
})
export class PbHeader {
  private readonly languageService = inject(LanguageService);

  protected readonly t = this.languageService.t;
  protected readonly siteName = siteConfig.name;

  protected readonly navItems = computed(() =>
    buildMainNav(this.t(), this.languageService.language()),
  );
}
