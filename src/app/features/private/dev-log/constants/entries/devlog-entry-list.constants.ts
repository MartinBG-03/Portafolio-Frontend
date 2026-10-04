import { Localized } from '../../../../../core/public/i18n/language';
import { AdOption } from '../../../../../shared/private/interfaces/ad-option.interface';
import { AdTableColumn } from '../../../../../shared/private/interfaces/ad-table.interface';
import { DevLogEntrySummary } from '../../interfaces/entries/devlog-entry.interface';

export const DEVLOG_ENTRY_STATUS_OPTIONS: Localized<readonly AdOption[]> = {
  es: [
    { value: '1', label: 'Activa' },
    { value: '0', label: 'Inactiva' },
  ],
  en: [
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' },
  ],
};

function buildColumns(
  headers: readonly [string, string, string, string, string],
  statusOptions: readonly AdOption[],
  descriptionOf: (row: DevLogEntrySummary) => string,
): readonly AdTableColumn<DevLogEntrySummary>[] {
  const [titleEs, titleEn, description, status, dateCreated] = headers;
  return [
    { key: 'titleEs', header: titleEs, filter: { type: 'text' } },
    { key: 'titleEn', header: titleEn, filter: { type: 'text' } },
    { key: 'description', header: description, value: descriptionOf },
    { key: 'status', header: status, filter: { type: 'option', options: statusOptions } },
    { key: 'dateCreated', header: dateCreated, filter: { type: 'date' } },
  ];
}

export const DEVLOG_ENTRY_TABLE_COLUMNS: Localized<readonly AdTableColumn<DevLogEntrySummary>[]> = {
  es: buildColumns(
    ['Título (ES)', 'Título (EN)', 'Descripción', 'Estado', 'Fecha de creación'],
    DEVLOG_ENTRY_STATUS_OPTIONS.es,
    (row) => row.descriptionEs,
  ),
  en: buildColumns(
    ['Title (ES)', 'Title (EN)', 'Description', 'Status', 'Creation date'],
    DEVLOG_ENTRY_STATUS_OPTIONS.en,
    (row) => row.descriptionEn,
  ),
};

export const DEVLOG_ENTRY_TEXTS: Localized<{
  readonly caption: string;
  readonly searchPlaceholder: string;
  readonly rowActionsLabel: string;
  readonly emptyText: string;
  readonly newEntry: string;
  readonly active: string;
  readonly inactive: string;
  readonly connectionError: string;
  readonly noFeaturedYet: string;
  readonly alreadyFeaturedHeading: string;
  readonly alreadyFeaturedMessage: (name: string) => string;
}> = {
  es: {
    caption: 'Entradas del DevLog',
    searchPlaceholder: 'Buscar entrada...',
    rowActionsLabel: 'Acciones de la entrada',
    emptyText: 'No hay entradas para mostrar.',
    newEntry: 'Nueva entrada',
    active: 'Activa',
    inactive: 'Inactiva',
    connectionError: 'No se pudo conectar con el servidor. Revisa que la API esté levantada.',
    noFeaturedYet: 'ninguna por ahora',
    alreadyFeaturedHeading: 'Ya es la entrada destacada',
    alreadyFeaturedMessage: (name) => `"${name}" ya es la entrada destacada.`,
  },
  en: {
    caption: 'DevLog entries',
    searchPlaceholder: 'Search entry...',
    rowActionsLabel: 'Entry actions',
    emptyText: 'There are no entries to show.',
    newEntry: 'New entry',
    active: 'Active',
    inactive: 'Inactive',
    connectionError: 'Could not connect to the server. Check that the API is running.',
    noFeaturedYet: 'none yet',
    alreadyFeaturedHeading: 'Already the featured entry',
    alreadyFeaturedMessage: (name) => `"${name}" is already the featured entry.`,
  },
};
