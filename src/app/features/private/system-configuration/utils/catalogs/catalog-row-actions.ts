import { AdMenuItem } from '../../../../../shared/private/interfaces/ad-menu.interface';
import { CatalogRowActionItems } from '../../constants/catalogs/catalog-actions.constants';
import { Catalog } from '../../interfaces/catalogs/catalog.interface';

export function catalogRowActions(
  catalog: Catalog,
  items: CatalogRowActionItems,
): readonly AdMenuItem[] {
  if (!catalog.status) {
    return [items.activate];
  }

  if (catalog.isSystemCatalog) {
    return [items.edit];
  }

  return [items.edit, items.delete, items.deactivate];
}
