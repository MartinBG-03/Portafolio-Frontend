export type PublicRouteKey =
  | 'home'
  | 'about'
  | 'projects'
  | 'academy'
  | 'devLog'
  | 'designSystem'
  | 'contact';

export type FooterGameTheme = 'city' | 'forest' | 'construction';

export interface SocialPlatformOption {
  readonly id: number;
  readonly code: string;
  readonly nameEs: string;
  readonly nameEn: string;
}

export interface FooterLink {
  readonly id: number;
  readonly routeKey: PublicRouteKey;
  readonly sortOrder: number;
  readonly status: boolean;
  readonly dateCreated: string;
  readonly dateUpdated?: string | null;
}

export interface SocialLink {
  readonly id: number;
  readonly catalogId: number;
  readonly platformCode: string;
  readonly platformNameEs: string;
  readonly platformNameEn: string;
  readonly value: string;
  readonly sortOrder: number;
  readonly status: boolean;
  readonly dateCreated: string;
  readonly dateUpdated?: string | null;
}

export interface GameSettings {
  readonly isVisible: boolean;
  readonly dateUpdated?: string | null;
}

export interface GameTheme {
  readonly id: number;
  readonly theme: FooterGameTheme;
  readonly isEnabled: boolean;
  readonly headlineEs: string;
  readonly headlineEn: string;
  readonly instructionsEs: string;
  readonly instructionsEn: string;
  readonly gameOverEs: string;
  readonly gameOverEn: string;
  readonly retryEs: string;
  readonly retryEn: string;
  readonly dateUpdated?: string | null;
}
