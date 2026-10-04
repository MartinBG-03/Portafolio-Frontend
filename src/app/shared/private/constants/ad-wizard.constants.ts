import { Localized } from '../../../core/public/i18n/language';

export const AD_WIZARD_TEXTS: Localized<{
  readonly previous: string;
  readonly next: string;
  readonly finish: string;
  readonly saving: string;
  readonly cancel: string;
  readonly progress: (current: number, total: number) => string;
}> = {
  es: {
    previous: 'Anterior',
    next: 'Siguiente',
    finish: 'Guardar',
    saving: 'Guardando...',
    cancel: 'Cancelar',
    progress: (current, total) => `Paso ${current} de ${total}`,
  },
  en: {
    previous: 'Previous',
    next: 'Next',
    finish: 'Save',
    saving: 'Saving...',
    cancel: 'Cancel',
    progress: (current, total) => `Step ${current} of ${total}`,
  },
};
