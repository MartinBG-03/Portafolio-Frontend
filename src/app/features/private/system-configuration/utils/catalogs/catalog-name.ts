import { Language } from '../../../../../core/public/i18n/language';
import { Catalog } from '../../interfaces/catalogs/catalog.interface';

export function catalogName(
  catalog: Pick<Catalog, 'nameEs' | 'nameEn'>,
  language: Language,
): string {
  return language === 'en' ? catalog.nameEn : catalog.nameEs;
}
