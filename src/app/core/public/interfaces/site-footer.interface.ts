export type FooterRouteKey = 'home' | 'about' | 'projects' | 'academy' | 'devLog' | 'designSystem' | 'contact';

export type FooterGameThemeKey = 'city' | 'forest' | 'construction';

export interface FooterLinkDto {
  readonly routeKey: FooterRouteKey;
}

export interface FooterSocialLinkDto {
  readonly code: string;
  readonly nameEs: string;
  readonly nameEn: string;
  readonly value: string;
}

export interface FooterGameThemeDto {
  readonly theme: FooterGameThemeKey;
  readonly headlineEs: string;
  readonly headlineEn: string;
  readonly instructionsEs: string;
  readonly instructionsEn: string;
  readonly gameOverEs: string;
  readonly gameOverEn: string;
  readonly retryEs: string;
  readonly retryEn: string;
}

export interface FooterGameSettingsDto {
  readonly isVisible: boolean;
  readonly themes: readonly FooterGameThemeDto[];
}

export interface SiteFooterDto {
  readonly links: readonly FooterLinkDto[];
  readonly socials: readonly FooterSocialLinkDto[];
  readonly game: FooterGameSettingsDto;
}
