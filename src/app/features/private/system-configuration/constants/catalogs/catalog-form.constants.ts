import { Localized } from '../../../../../core/public/i18n/language';

export const CATALOG_LIMITS = {
  codeMaxLength: 10,
  nameMaxLength: 50,
  descriptionMaxLength: 350,
} as const;

export const CATALOG_FORM_TEXTS: Localized<{
  readonly createRoot: string;
  readonly createChild: string;
  readonly editRoot: string;
  readonly editChild: string;
  readonly rootCrumb: string;
  readonly newCrumb: string;
  readonly pathLabel: string;
  readonly identification: string;
  readonly content: string;
  readonly advanced: string;
  readonly parentCatalog: string;
  readonly code: string;
  readonly codePlaceholder: string;
  readonly nameEs: string;
  readonly nameEsPlaceholder: string;
  readonly nameEn: string;
  readonly nameEnPlaceholder: string;
  readonly descriptionEs: string;
  readonly descriptionEsPlaceholder: string;
  readonly descriptionEn: string;
  readonly descriptionEnPlaceholder: string;
  readonly order: string;
  readonly codeHint: (length: number, max: number) => string;
  readonly isSystemCatalog: string;
  readonly isSystemCatalogHint: string;
  readonly codeLockedHint: string;
  readonly save: string;
  readonly cancel: string;
}> = {
  es: {
    createRoot: 'Nuevo catálogo',
    createChild: 'Nuevo subcatálogo',
    editRoot: 'Editar catálogo',
    editChild: 'Editar subcatálogo',
    rootCrumb: 'Catálogos',
    newCrumb: 'Nuevo',
    pathLabel: 'Ruta del catálogo',
    identification: 'Identificación',
    content: 'Contenido en dos idiomas',
    advanced: 'Opciones avanzadas',
    parentCatalog: 'Catálogo padre',
    code: 'Código',
    codePlaceholder: 'Ej. RANGOEDAD',
    nameEs: 'Nombre (ES)',
    nameEsPlaceholder: 'Ej. Rangos de edad',
    nameEn: 'Nombre (EN)',
    nameEnPlaceholder: 'Ej. Age ranges',
    descriptionEs: 'Descripción (ES)',
    descriptionEsPlaceholder: 'Ej. Rangos de edad disponibles',
    descriptionEn: 'Descripción (EN)',
    descriptionEnPlaceholder: 'Ej. Available age ranges',
    order: 'Orden',
    codeHint: (length, max) => `Se guarda en mayúsculas · ${length} / ${max}`,
    isSystemCatalog: 'Es un catálogo del sistema',
    isSystemCatalogHint: 'Otros módulos dependen de él: no podrá eliminarse ni desactivarse, y su código quedará fijo. No se puede cambiar después de crearlo.',
    codeLockedHint: 'Es un catálogo del sistema: el código no se puede cambiar.',
    save: 'Guardar',
    cancel: 'Cancelar',
  },
  en: {
    createRoot: 'New catalog',
    createChild: 'New subcatalog',
    editRoot: 'Edit catalog',
    editChild: 'Edit subcatalog',
    rootCrumb: 'Catalogs',
    newCrumb: 'New',
    pathLabel: 'Catalog path',
    identification: 'Identification',
    content: 'Content in two languages',
    advanced: 'Advanced options',
    parentCatalog: 'Parent catalog',
    code: 'Code',
    codePlaceholder: 'e.g. AGERANGE',
    nameEs: 'Name (ES)',
    nameEsPlaceholder: 'e.g. Rangos de edad',
    nameEn: 'Name (EN)',
    nameEnPlaceholder: 'e.g. Age ranges',
    descriptionEs: 'Description (ES)',
    descriptionEsPlaceholder: 'e.g. Rangos de edad disponibles',
    descriptionEn: 'Description (EN)',
    descriptionEnPlaceholder: 'e.g. Available age ranges',
    order: 'Order',
    codeHint: (length, max) => `Saved in uppercase · ${length} / ${max}`,
    isSystemCatalog: 'This is a system catalog',
    isSystemCatalogHint: 'Other modules depend on it: it cannot be deleted or deactivated, and its code will stay fixed. This cannot be changed after creating it.',
    codeLockedHint: 'This is a system catalog: the code cannot be changed.',
    save: 'Save',
    cancel: 'Cancel',
  },
};

export const CATALOG_FORM_MESSAGES: Localized<{
  readonly required: string;
  readonly maxLength: (limit: number) => string;
  readonly min: (limit: number) => string;
}> = {
  es: {
    required: 'Este campo es obligatorio.',
    maxLength: (limit) => `Máximo ${limit} caracteres.`,
    min: (limit) => `Debe ser mayor o igual a ${limit}.`,
  },
  en: {
    required: 'This field is required.',
    maxLength: (limit) => `Maximum ${limit} characters.`,
    min: (limit) => `Must be greater than or equal to ${limit}.`,
  },
};
