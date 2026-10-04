import { Localized } from '../../../../../core/public/i18n/language';
import { DevLogEntryConfirmableAction } from './devlog-entry-actions.constants';

export interface DevLogEntryFeedbackText {
  readonly heading: string;
  readonly message: (name: string) => string;
}

export type DevLogEntrySuccessFeedback = Readonly<
  Record<'create' | 'update' | DevLogEntryConfirmableAction, DevLogEntryFeedbackText>
>;

export type DevLogEntryErrorHeadings = Readonly<
  Record<'create' | 'update' | DevLogEntryConfirmableAction | 'list' | 'get' | 'categories', string>
>;

export interface DevLogEntryEmptyFeedback {
  readonly heading: string;
  readonly message: string;
}

export const DEVLOG_ENTRY_SUCCESS_FEEDBACK: Localized<DevLogEntrySuccessFeedback> = {
  es: {
    feature: {
      heading: 'Entrada destacada actualizada',
      message: (name) => `"${name}" ahora es la entrada destacada.`,
    },
    create: {
      heading: 'Entrada creada',
      message: (name) => `"${name}" se registró correctamente.`,
    },
    update: {
      heading: 'Entrada actualizada',
      message: (name) => `Se guardaron los cambios de "${name}".`,
    },
    delete: {
      heading: 'Entrada eliminada',
      message: (name) => `"${name}" ya no aparece en la lista.`,
    },
    activate: {
      heading: 'Entrada activada',
      message: (name) => `"${name}" vuelve a estar disponible en el sitio público.`,
    },
    deactivate: {
      heading: 'Entrada inactivada',
      message: (name) => `"${name}" dejó de estar disponible mientras permanezca inactiva.`,
    },
  },
  en: {
    feature: {
      heading: 'Featured entry updated',
      message: (name) => `"${name}" is now the featured entry.`,
    },
    create: {
      heading: 'Entry created',
      message: (name) => `"${name}" was registered successfully.`,
    },
    update: {
      heading: 'Entry updated',
      message: (name) => `The changes to "${name}" were saved.`,
    },
    delete: {
      heading: 'Entry deleted',
      message: (name) => `"${name}" no longer appears in the list.`,
    },
    activate: {
      heading: 'Entry activated',
      message: (name) => `"${name}" is available on the public site again.`,
    },
    deactivate: {
      heading: 'Entry deactivated',
      message: (name) => `"${name}" is no longer available while it stays inactive.`,
    },
  },
};

export const DEVLOG_ENTRY_ERROR_HEADINGS: Localized<DevLogEntryErrorHeadings> = {
  es: {
    feature: 'No se pudo cambiar la entrada destacada',
    create: 'No se pudo crear la entrada',
    update: 'No se pudo actualizar la entrada',
    delete: 'No se pudo eliminar la entrada',
    activate: 'No se pudo activar la entrada',
    deactivate: 'No se pudo inactivar la entrada',
    list: 'No se pudieron cargar las entradas',
    get: 'No se pudo cargar la entrada',
    categories: 'No se pudieron cargar las categorías del DevLog',
  },
  en: {
    feature: 'The featured entry could not be changed',
    create: 'The entry could not be created',
    update: 'The entry could not be updated',
    delete: 'The entry could not be deleted',
    activate: 'The entry could not be activated',
    deactivate: 'The entry could not be deactivated',
    list: 'The entries could not be loaded',
    get: 'The entry could not be loaded',
    categories: 'The DevLog categories could not be loaded',
  },
};

export const DEVLOG_ENTRY_EMPTY_FEEDBACK: Localized<{
  readonly noData: DevLogEntryEmptyFeedback;
  readonly noMatches: DevLogEntryEmptyFeedback;
}> = {
  es: {
    noData: {
      heading: 'Sin entradas registradas',
      message: 'Todavía no hay entradas del DevLog. Crea la primera con "Nueva entrada".',
    },
    noMatches: {
      heading: 'Sin resultados',
      message: 'Ninguna entrada coincide con la búsqueda o los filtros aplicados.',
    },
  },
  en: {
    noData: {
      heading: 'No entries registered',
      message: 'There are no DevLog entries yet. Create the first one with "New entry".',
    },
    noMatches: {
      heading: 'No results',
      message: 'No entry matches the search or the applied filters.',
    },
  },
};

export const DEVLOG_ENTRY_UPLOAD_FEEDBACK: Localized<{
  readonly failedHeading: string;
  readonly failedMessage: (fileName: string) => string;
}> = {
  es: {
    failedHeading: 'No se pudo subir el archivo',
    failedMessage: (fileName) => `"${fileName}" no se pudo subir. Intenta de nuevo.`,
  },
  en: {
    failedHeading: 'The file could not be uploaded',
    failedMessage: (fileName) => `"${fileName}" could not be uploaded. Try again.`,
  },
};
