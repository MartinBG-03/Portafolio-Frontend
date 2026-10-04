import { FooterGameTheme, PublicRouteKey } from './footer.interface';

export interface SaveFooterLinkRequest {
  readonly routeKey: PublicRouteKey;
  readonly sortOrder: number;
}

export interface SaveSocialLinkRequest {
  readonly catalogId: number;
  readonly value: string;
  readonly sortOrder: number;
}

export interface ChangeFooterStatusRequest {
  readonly status: boolean;
}

export interface UpdateGameSettingsRequest {
  readonly isVisible: boolean;
}

export interface UpdateGameThemeRequest {
  readonly isEnabled: boolean;
  readonly headlineEs: string;
  readonly headlineEn: string;
  readonly instructionsEs: string;
  readonly instructionsEn: string;
  readonly gameOverEs: string;
  readonly gameOverEn: string;
  readonly retryEs: string;
  readonly retryEn: string;
}

export interface GameThemeFormValue extends UpdateGameThemeRequest {
  readonly theme: FooterGameTheme;
}
