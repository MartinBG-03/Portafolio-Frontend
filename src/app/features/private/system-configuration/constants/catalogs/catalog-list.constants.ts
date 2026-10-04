import { Localized } from '../../../../../core/public/i18n/language';
import { AdOption } from '../../../../../shared/private/interfaces/ad-option.interface';
import { AdTableColumn } from '../../../../../shared/private/interfaces/ad-table.interface';
import { Catalog } from '../../interfaces/catalogs/catalog.interface';

export const CATALOG_STATUS_OPTIONS: Localized<readonly AdOption[]> = {
  es: [
    { value: '1', label: 'Activo' },
    { value: '0', label: 'Inactivo' },
  ],
  en: [
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' },
  ],
};

export const CATALOG_IS_SYSTEM_OPTIONS: Localized<readonly AdOption[]> = {
  es: [
    { value: '1', label: 'Aplica' },
    { value: '0', label: 'No aplica' },
  ],
  en: [
    { value: '1', label: 'Applies' },
    { value: '0', label: 'Does not apply' },
  ],
};

function buildColumns(
  lang: 'es' | 'en',
  headers: readonly [string, string, string, string, string, string, string],
  statusOptions: readonly AdOption[],
  isSystemOptions: readonly AdOption[],
): readonly AdTableColumn<Catalog>[] {
  const [code, name, description, isSystemCatalog, status, sortOrder, childrenCount] = headers;
  const nameKey = lang === 'es' ? 'nameEs' : 'nameEn';
  const descriptionKey = lang === 'es' ? 'descriptionEs' : 'descriptionEn';
  return [
    { key: 'code', header: code, filter: { type: 'text' } },
    { key: nameKey, header: name, filter: { type: 'text' } },
    { key: descriptionKey, header: description, filter: { type: 'text' } },
    {
      key: 'isSystemCatalog',
      header: isSystemCatalog,
      filter: { type: 'option', options: isSystemOptions },
    },
    { key: 'status', header: status, filter: { type: 'option', options: statusOptions } },
    { key: 'sortOrder', header: sortOrder, align: 'end', filter: { type: 'number' } },
    { key: 'childrenCount', header: childrenCount, align: 'end', filter: { type: 'number' } },
  ];
}

export const CATALOG_TABLE_COLUMNS: Localized<readonly AdTableColumn<Catalog>[]> = {
  es: buildColumns(
    'es',
    ['Código', 'Nombre', 'Descripción', 'Catálogo de sistema', 'Estado', 'Orden', 'Subcatálogos'],
    CATALOG_STATUS_OPTIONS.es,
    CATALOG_IS_SYSTEM_OPTIONS.es,
  ),
  en: buildColumns(
    'en',
    ['Code', 'Name', 'Description', 'System catalog', 'Status', 'Order', 'Subcatalogs'],
    CATALOG_STATUS_OPTIONS.en,
    CATALOG_IS_SYSTEM_OPTIONS.en,
  ),
};

export const CATALOG_PATH_SEPARATOR = ' > ';

export const CATALOG_TEXTS: Localized<{
  readonly caption: string;
  readonly searchPlaceholder: string;
  readonly childSearchPlaceholder: string;
  readonly rowActionsLabel: string;
  readonly emptyText: string;
  readonly childCaption: string;
  readonly newCatalog: string;
  readonly newSubcatalog: string;
  readonly active: string;
  readonly inactive: string;
  readonly systemApplies: string;
  readonly systemNotApplies: string;
  readonly connectionError: string;
}> = {
  es: {
    caption: 'Catálogos',
    searchPlaceholder: 'Buscar catálogo...',
    childSearchPlaceholder: 'Buscar subcatálogo...',
    rowActionsLabel: 'Acciones del catálogo',
    emptyText: 'No hay catálogos para mostrar.',
    childCaption: 'Subcatálogos',
    newCatalog: 'Nuevo catálogo',
    newSubcatalog: 'Nuevo subcatálogo',
    active: 'Activo',
    inactive: 'Inactivo',
    systemApplies: 'Aplica',
    systemNotApplies: 'No aplica',
    connectionError: 'No se pudo conectar con el servidor. Revisa que la API esté levantada.',
  },
  en: {
    caption: 'Catalogs',
    searchPlaceholder: 'Search catalog...',
    childSearchPlaceholder: 'Search subcatalog...',
    rowActionsLabel: 'Catalog actions',
    emptyText: 'There are no catalogs to show.',
    childCaption: 'Subcatalogs',
    newCatalog: 'New catalog',
    newSubcatalog: 'New subcatalog',
    active: 'Active',
    inactive: 'Inactive',
    systemApplies: 'Applies',
    systemNotApplies: 'Does not apply',
    connectionError: 'Could not connect to the server. Check that the API is running.',
  },
};
