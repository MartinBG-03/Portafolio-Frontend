export const SITE_FOOTER_ENDPOINTS = {
  links: 'site-footer/links',
  linkById: (id: number) => `site-footer/links/${id}`,
  linkStatus: (id: number) => `site-footer/links/${id}/status`,
  socials: 'site-footer/socials',
  socialById: (id: number) => `site-footer/socials/${id}`,
  socialStatus: (id: number) => `site-footer/socials/${id}/status`,
  gameSettings: 'site-footer/game-settings',
  gameThemes: 'site-footer/game-themes',
  gameThemeById: (id: number) => `site-footer/game-themes/${id}`,
} as const;
