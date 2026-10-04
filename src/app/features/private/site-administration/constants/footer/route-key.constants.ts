import { Localized } from '../../../../../core/public/i18n/language';
import { PublicRouteKey } from '../../interfaces/footer/footer.interface';

export const ALL_ROUTE_KEYS: readonly PublicRouteKey[] = [
  'home',
  'about',
  'projects',
  'academy',
  'devLog',
  'designSystem',
  'contact',
];

export const ROUTE_KEY_TEXTS: Localized<Readonly<Record<PublicRouteKey, string>>> = {
  es: {
    home: 'Inicio',
    about: 'Sobre mí',
    projects: 'Proyectos',
    academy: 'DevAcademy',
    devLog: 'DevLog',
    designSystem: 'Design System',
    contact: 'Contacto',
  },
  en: {
    home: 'Home',
    about: 'About me',
    projects: 'Projects',
    academy: 'DevAcademy',
    devLog: 'DevLog',
    designSystem: 'Design System',
    contact: 'Contact',
  },
};
