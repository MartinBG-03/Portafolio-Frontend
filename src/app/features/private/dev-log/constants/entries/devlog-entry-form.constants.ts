import { Localized } from '../../../../../core/public/i18n/language';
import { AdMediaKind } from '../../../../../shared/private/interfaces/ad-media.interface';
import { AdOption } from '../../../../../shared/private/interfaces/ad-option.interface';
import { DevLogMediaType } from '../../interfaces/entries/devlog-entry.interface';

export const DEVLOG_MEDIA_KIND_BY_TYPE: Readonly<Record<DevLogMediaType, AdMediaKind>> = {
  document: 'file',
  image: 'image',
  video: 'video',
  audio: 'audio',
};

export const DEVLOG_ENTRY_LIMITS = {
  titleMaxLength: 200,
  descriptionMaxLength: 500,
  mediaTitleMaxLength: 150,
  mediaBodyMaxLength: 500,
} as const;

export const DEVLOG_MEDIA_ACCEPT = {
  document: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip',
  video: 'video/*',
  audio: 'audio/*',
} as const;

export const DEVLOG_TITLE_DESIGN_OPTIONS: Localized<readonly AdOption[]> = {
  es: [
    { value: 'left', label: 'Izquierda' },
    { value: 'right', label: 'Derecha' },
  ],
  en: [
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' },
  ],
};

export const DEVLOG_ENTRY_FORM_TEXTS: Localized<{
  readonly createHeading: string;
  readonly editHeading: string;
  readonly wizardLabel: string;
  readonly back: string;
  readonly cancel: string;
  readonly save: string;
  readonly connectionError: string;
  readonly unsavedChangesHeading: string;
  readonly unsavedChangesMessage: string;
  readonly unsavedChangesConfirm: string;
  readonly unsavedChangesCancel: string;
  readonly stepGeneral: string;
  readonly stepContent: string;
  readonly stepCover: string;
  readonly stepMedia: string;
  readonly titleEs: string;
  readonly titleEn: string;
  readonly descriptionEs: string;
  readonly descriptionEn: string;
  readonly categories: string;
  readonly categoriesEmpty: string;
  readonly displayDate: string;
  readonly displayDateHint: string;
  readonly isFeatured: string;
  readonly isFeaturedHint: string;
  readonly slugEs: string;
  readonly slugEn: string;
  readonly bodyEs: string;
  readonly bodyEn: string;
  readonly coverInside: string;
  readonly coverInsideHint: string;
  readonly coverOutside: string;
  readonly coverOutsideHint: string;
  readonly titleDesign: string;
  readonly preview: string;
  readonly documents: string;
  readonly images: string;
  readonly videos: string;
  readonly audios: string;
  readonly addFile: string;
}> = {
  es: {
    createHeading: 'Nueva entrada del DevLog',
    editHeading: 'Editar entrada del DevLog',
    wizardLabel: 'Pasos de la entrada',
    back: 'Volver',
    cancel: 'Cancelar',
    save: 'Guardar entrada',
    connectionError: 'No se pudo conectar con el servidor. Revisa que la API esté levantada.',
    unsavedChangesHeading: 'Cambios sin guardar',
    unsavedChangesMessage: 'Si sales ahora, se perderán los cambios que no has guardado.',
    unsavedChangesConfirm: 'Salir sin guardar',
    unsavedChangesCancel: 'Seguir editando',
    stepGeneral: 'General',
    stepContent: 'Contenido',
    stepCover: 'Portada',
    stepMedia: 'Recursos digitales',
    titleEs: 'Título (ES)',
    titleEn: 'Título (EN)',
    descriptionEs: 'Descripción (ES)',
    descriptionEn: 'Descripción (EN)',
    categories: 'Categorías',
    categoriesEmpty: 'No hay categorías del DevLog registradas todavía.',
    displayDate: 'Fecha de visualización',
    displayDateHint: 'Es la fecha que se muestra al público. La fecha real de creación queda registrada aparte, como auditoría.',
    isFeatured: 'Entrada destacada',
    isFeaturedHint: 'Solo puede haber una entrada destacada a la vez. Si marcas esta, se quitará de la que lo esté actualmente.',
    slugEs: 'Slug (ES)',
    slugEn: 'Slug (EN)',
    bodyEs: 'Cuerpo (ES)',
    bodyEn: 'Cuerpo (EN)',
    coverInside: 'Portada interior',
    coverInsideHint: 'Se usa como fondo de la tarjeta de título dentro de la entrada.',
    coverOutside: 'Portada exterior',
    coverOutsideHint: 'Se usa como miniatura al navegar el listado del DevLog.',
    titleDesign: 'Posición de los botones de acción',
    preview: 'Vista previa',
    documents: 'Documentos',
    images: 'Imágenes',
    videos: 'Videos',
    audios: 'Audios',
    addFile: 'Agregar archivo',
  },
  en: {
    createHeading: 'New DevLog entry',
    editHeading: 'Edit DevLog entry',
    wizardLabel: 'Entry steps',
    back: 'Back',
    cancel: 'Cancel',
    save: 'Save entry',
    connectionError: 'Could not connect to the server. Check that the API is running.',
    unsavedChangesHeading: 'Unsaved changes',
    unsavedChangesMessage: 'If you leave now, your unsaved changes will be lost.',
    unsavedChangesConfirm: 'Leave without saving',
    unsavedChangesCancel: 'Keep editing',
    stepGeneral: 'General',
    stepContent: 'Content',
    stepCover: 'Cover',
    stepMedia: 'Digital resources',
    titleEs: 'Title (ES)',
    titleEn: 'Title (EN)',
    descriptionEs: 'Description (ES)',
    descriptionEn: 'Description (EN)',
    categories: 'Categories',
    categoriesEmpty: 'There are no DevLog categories registered yet.',
    displayDate: 'Display date',
    displayDateHint: 'This is the date shown to the public. The actual creation date is kept separately, for audit purposes.',
    isFeatured: 'Featured entry',
    isFeaturedHint: 'Only one entry can be featured at a time. Turning this on will unfeature whichever entry is currently featured.',
    slugEs: 'Slug (ES)',
    slugEn: 'Slug (EN)',
    bodyEs: 'Body (ES)',
    bodyEn: 'Body (EN)',
    coverInside: 'Inside cover',
    coverInsideHint: 'Used as the background of the title card inside the entry.',
    coverOutside: 'Outside cover',
    coverOutsideHint: 'Used as the thumbnail when browsing the DevLog list.',
    titleDesign: 'Action buttons position',
    preview: 'Live preview',
    documents: 'Documents',
    images: 'Images',
    videos: 'Videos',
    audios: 'Audios',
    addFile: 'Add file',
  },
};

export const DEVLOG_ENTRY_FORM_MESSAGES: Localized<{
  readonly required: string;
  readonly maxLength: (limit: number) => string;
}> = {
  es: {
    required: 'Este campo es obligatorio.',
    maxLength: (limit) => `Máximo ${limit} caracteres.`,
  },
  en: {
    required: 'This field is required.',
    maxLength: (limit) => `Maximum ${limit} characters.`,
  },
};

export const DEVLOG_RESOURCE_ITEM_FORM_TEXTS: Localized<{
  readonly heading: string;
  readonly titleEs: string;
  readonly titleEn: string;
  readonly bodyEs: string;
  readonly bodyEn: string;
  readonly save: string;
  readonly cancel: string;
}> = {
  es: {
    heading: 'Detalle del recurso',
    titleEs: 'Título (ES)',
    titleEn: 'Título (EN)',
    bodyEs: 'Descripción (ES)',
    bodyEn: 'Descripción (EN)',
    save: 'Agregar',
    cancel: 'Cancelar',
  },
  en: {
    heading: 'Resource detail',
    titleEs: 'Title (ES)',
    titleEn: 'Title (EN)',
    bodyEs: 'Description (ES)',
    bodyEn: 'Description (EN)',
    save: 'Add',
    cancel: 'Cancel',
  },
};
