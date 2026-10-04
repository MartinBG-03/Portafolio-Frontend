import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../../core/public/services/language.service';
import { ThemeService } from '../../../../core/public/services/theme.service';
import { Icon } from '../../../components/icon/icon';
import { AdTooltipDirective } from '../../../private/directives/ad-tooltip.directive';

@Component({
  selector: 'pb-theme-toggle',
  imports: [Icon, AdTooltipDirective],
  templateUrl: './pb-theme-toggle.html',
  styleUrl: './pb-theme-toggle.scss',
})
export class PbThemeToggle {
  protected readonly themeService = inject(ThemeService);
  protected readonly t = inject(LanguageService).t;
}
