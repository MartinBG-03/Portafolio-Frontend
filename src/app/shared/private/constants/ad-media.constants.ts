import { Localized } from '../../../core/public/i18n/language';
import { AdIconName } from '../components/ad-icon/ad-icon-registry';
import { AdMediaKind } from '../interfaces/ad-media.interface';

export const AD_MEDIA_KIND_ICONS: Readonly<Record<AdMediaKind, AdIconName>> = {
  image: 'image',
  video: 'video',
  audio: 'audio',
  file: 'file',
};

export const AD_FILE_PICKER_TEXTS: Localized<{
  readonly drop: string;
  readonly dropSingle: string;
  readonly choose: string;
  readonly chooseSingle: string;
  readonly dropReplace: string;
  readonly replace: string;
  readonly uploading: string;
}> = {
  es: {
    drop: 'Arrastra los archivos aquí o',
    dropSingle: 'Arrastra el archivo aquí o',
    choose: 'Elegir archivos',
    chooseSingle: 'Elegir archivo',
    dropReplace: 'Arrastra otro archivo para reemplazarlo o',
    replace: 'Cambiar archivo',
    uploading: 'Subiendo...',
  },
  en: {
    drop: 'Drag the files here or',
    dropSingle: 'Drag the file here or',
    choose: 'Choose files',
    chooseSingle: 'Choose file',
    dropReplace: 'Drag another file to replace it or',
    replace: 'Change file',
    uploading: 'Uploading...',
  },
};

export const AD_MEDIA_LIST_TEXTS: Localized<{
  readonly empty: string;
  readonly open: (name: string) => string;
  readonly moveUp: (name: string) => string;
  readonly moveDown: (name: string) => string;
  readonly remove: (name: string) => string;
  readonly toggle: (name: string) => string;
  readonly hidden: string;
}> = {
  es: {
    empty: 'Todavía no hay archivos.',
    open: (name) => `Abrir ${name}`,
    moveUp: (name) => `Subir ${name}`,
    moveDown: (name) => `Bajar ${name}`,
    remove: (name) => `Quitar ${name}`,
    toggle: (name) => `Mostrar ${name} en el sitio`,
    hidden: 'Oculto',
  },
  en: {
    empty: 'There are no files yet.',
    open: (name) => `Open ${name}`,
    moveUp: (name) => `Move ${name} up`,
    moveDown: (name) => `Move ${name} down`,
    remove: (name) => `Remove ${name}`,
    toggle: (name) => `Show ${name} on the site`,
    hidden: 'Hidden',
  },
};
