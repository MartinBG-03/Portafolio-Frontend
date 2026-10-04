import { Localized } from '../../../../../core/public/i18n/language';
import { FooterGameTheme } from '../../interfaces/footer/footer.interface';

export const ALL_GAME_THEMES: readonly FooterGameTheme[] = ['city', 'forest', 'construction'];

export const GAME_THEME_TEXTS: Localized<Readonly<Record<FooterGameTheme, string>>> = {
  es: {
    city: 'Un día en la ciudad',
    forest: 'Bosque encantado',
    construction: 'Obra en construcción',
  },
  en: {
    city: 'A day in the city',
    forest: 'Enchanted forest',
    construction: 'Construction site',
  },
};
