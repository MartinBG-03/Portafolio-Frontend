import { Localized } from '../../core/public/i18n/language';

export const API_ERROR_TEXTS: Localized<{
  readonly notFound: string;
  readonly forbidden: string;
}> = {
  es: {
    notFound: 'La página solicitada no existe.',
    forbidden: 'No cuenta con autorización para realizar esta acción.',
  },
  en: {
    notFound: 'The requested page does not exist.',
    forbidden: 'You are not authorized to perform this action.',
  },
};
