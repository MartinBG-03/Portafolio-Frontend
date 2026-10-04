import { Localized } from '../../../../../core/public/i18n/language';

export interface FooterPageTexts {
  readonly linksSection: string;
  readonly linksHint: string;
  readonly newLink: string;
  readonly noLinks: string;
  readonly socialsSection: string;
  readonly socialsHint: string;
  readonly newSocial: string;
  readonly noSocials: string;
  readonly gameSection: string;
  readonly gameVisible: string;
  readonly editTheme: string;
  readonly active: string;
  readonly inactive: string;
  readonly rowActionsLabel: string;
  readonly connectionError: string;
}

export const FOOTER_PAGE_TEXTS: Localized<FooterPageTexts> = {
  es: {
    linksSection: 'Enlaces del pie de página',
    linksHint: 'Elige qué páginas públicas se muestran como enlaces en el pie de página y en qué orden.',
    newLink: 'Nuevo enlace',
    noLinks: 'Todavía no hay enlaces configurados.',
    socialsSection: 'Redes sociales y contacto',
    socialsHint: 'Administra los íconos de redes sociales y contacto que aparecen en el pie de página.',
    newSocial: 'Nueva red social',
    noSocials: 'Todavía no hay redes sociales configuradas.',
    gameSection: 'Minijuego',
    gameVisible: 'Mostrar el minijuego en el pie de página',
    editTheme: 'Editar modo',
    active: 'Activo',
    inactive: 'Inactivo',
    rowActionsLabel: 'Acciones',
    connectionError: 'No se pudo conectar con el servidor.',
  },
  en: {
    linksSection: 'Footer links',
    linksHint: 'Choose which public pages show up as links in the footer, and in what order.',
    newLink: 'New link',
    noLinks: 'No links configured yet.',
    socialsSection: 'Social and contact',
    socialsHint: 'Manage the social and contact icons shown in the footer.',
    newSocial: 'New social link',
    noSocials: 'No social links configured yet.',
    gameSection: 'Minigame',
    gameVisible: 'Show the minigame in the footer',
    editTheme: 'Edit mode',
    active: 'Active',
    inactive: 'Inactive',
    rowActionsLabel: 'Actions',
    connectionError: 'Could not connect to the server.',
  },
};
