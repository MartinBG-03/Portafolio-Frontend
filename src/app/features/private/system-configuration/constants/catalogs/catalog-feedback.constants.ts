import { Localized } from '../../../../../core/public/i18n/language';
import { CatalogConfirmableAction } from './catalog-actions.constants';

export interface CatalogFeedbackText {
  readonly heading: string;
  readonly message: (name: string) => string;
}

export type CatalogSuccessFeedback = Readonly<
  Record<'create' | 'update' | CatalogConfirmableAction, CatalogFeedbackText>
>;

export type CatalogErrorHeadings = Readonly<
  Record<'create' | 'update' | CatalogConfirmableAction | 'list' | 'children', string>
>;

export interface CatalogEmptyFeedback {
  readonly heading: string;
  readonly message: string;
}

export const CATALOG_SUCCESS_FEEDBACK: Localized<CatalogSuccessFeedback> = {
  es: {
    create: {
      heading: 'Catálogo creado',
      message: (name) => `"${name}" se registró correctamente.`,
    },
    update: {
      heading: 'Catálogo actualizado',
      message: (name) => `Se guardaron los cambios de "${name}".`,
    },
    delete: {
      heading: 'Catálogo eliminado',
      message: (name) => `"${name}" ya no aparece en la lista.`,
    },
    activate: {
      heading: 'Catálogo activado',
      message: (name) => `"${name}" vuelve a estar disponible en el sistema.`,
    },
    deactivate: {
      heading: 'Catálogo inactivado',
      message: (name) => `"${name}" dejó de estar disponible mientras permanezca inactivo.`,
    },
  },
  en: {
    create: {
      heading: 'Catalog created',
      message: (name) => `"${name}" was registered successfully.`,
    },
    update: {
      heading: 'Catalog updated',
      message: (name) => `The changes to "${name}" were saved.`,
    },
    delete: {
      heading: 'Catalog deleted',
      message: (name) => `"${name}" no longer appears in the list.`,
    },
    activate: {
      heading: 'Catalog activated',
      message: (name) => `"${name}" is available in the system again.`,
    },
    deactivate: {
      heading: 'Catalog deactivated',
      message: (name) => `"${name}" is no longer available while it stays inactive.`,
    },
  },
};

export const CATALOG_ERROR_HEADINGS: Localized<CatalogErrorHeadings> = {
  es: {
    create: 'No se pudo crear el catálogo',
    update: 'No se pudo actualizar el catálogo',
    delete: 'No se pudo eliminar el catálogo',
    activate: 'No se pudo activar el catálogo',
    deactivate: 'No se pudo inactivar el catálogo',
    list: 'No se pudieron cargar los catálogos',
    children: 'No se pudieron cargar los subcatálogos',
  },
  en: {
    create: 'The catalog could not be created',
    update: 'The catalog could not be updated',
    delete: 'The catalog could not be deleted',
    activate: 'The catalog could not be activated',
    deactivate: 'The catalog could not be deactivated',
    list: 'The catalogs could not be loaded',
    children: 'The subcatalogs could not be loaded',
  },
};

export const CATALOG_EMPTY_FEEDBACK: Localized<{
  readonly noData: CatalogEmptyFeedback;
  readonly noMatches: CatalogEmptyFeedback;
}> = {
  es: {
    noData: {
      heading: 'Sin catálogos registrados',
      message: 'Todavía no hay catálogos. Crea el primero con "Nuevo catálogo".',
    },
    noMatches: {
      heading: 'Sin resultados',
      message: 'Ningún catálogo coincide con la búsqueda o los filtros aplicados.',
    },
  },
  en: {
    noData: {
      heading: 'No catalogs registered',
      message: 'There are no catalogs yet. Create the first one with "New catalog".',
    },
    noMatches: {
      heading: 'No results',
      message: 'No catalog matches the search or the applied filters.',
    },
  },
};
