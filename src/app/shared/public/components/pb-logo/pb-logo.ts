import { Component, computed, inject, input } from '@angular/core';
import { ThemeService } from '../../../../core/public/services/theme.service';

const LOGO_FOR_LIGHT_MODE = 'images/public/logos/logo-dark.png';
const LOGO_FOR_DARK_MODE = 'images/public/logos/logo-light.png';

@Component({
  selector: 'pb-logo',
  templateUrl: './pb-logo.html',
  styleUrl: './pb-logo.scss',
})
export class PbLogo {
  private readonly themeService = inject(ThemeService);

  readonly alt = input('');

  protected readonly src = computed(() =>
    this.themeService.isDark() ? LOGO_FOR_DARK_MODE : LOGO_FOR_LIGHT_MODE,
  );
}
