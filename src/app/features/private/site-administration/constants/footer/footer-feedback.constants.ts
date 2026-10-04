import { Localized } from '../../../../../core/public/i18n/language';
import { FooterConfirmableAction } from './footer-actions.constants';

export interface FooterFeedbackText {
  readonly heading: string;
  readonly message: (name: string) => string;
}

export type FooterSuccessFeedback = Readonly<
  Record<'create' | 'update' | FooterConfirmableAction, FooterFeedbackText>
>;

export type FooterErrorHeadings = Readonly<
  Record<'create' | 'update' | FooterConfirmableAction | 'list', string>
>;

export const FOOTER_LINK_SUCCESS_FEEDBACK: Localized<FooterSuccessFeedback> = {
  es: {
    create: { heading: 'Enlace agregado', message: (name) => `"${name}" se agregó al pie de página.` },
    update: { heading: 'Enlace actualizado', message: (name) => `Se guardaron los cambios del enlace a "${name}".` },
    delete: { heading: 'Enlace eliminado', message: (name) => `El enlace a "${name}" ya no aparece en el pie de página.` },
    activate: { heading: 'Enlace activado', message: (name) => `El enlace a "${name}" vuelve a verse en el pie de página.` },
    deactivate: { heading: 'Enlace inactivado', message: (name) => `El enlace a "${name}" dejó de verse en el pie de página.` },
  },
  en: {
    create: { heading: 'Link added', message: (name) => `"${name}" was added to the footer.` },
    update: { heading: 'Link updated', message: (name) => `The changes to the link to "${name}" were saved.` },
    delete: { heading: 'Link deleted', message: (name) => `The link to "${name}" no longer appears in the footer.` },
    activate: { heading: 'Link activated', message: (name) => `The link to "${name}" shows in the footer again.` },
    deactivate: { heading: 'Link deactivated', message: (name) => `The link to "${name}" no longer shows in the footer.` },
  },
};

export const FOOTER_LINK_ERROR_HEADINGS: Localized<FooterErrorHeadings> = {
  es: {
    create: 'No se pudo agregar el enlace',
    update: 'No se pudo actualizar el enlace',
    delete: 'No se pudo eliminar el enlace',
    activate: 'No se pudo activar el enlace',
    deactivate: 'No se pudo inactivar el enlace',
    list: 'No se pudieron cargar los enlaces',
  },
  en: {
    create: 'The link could not be added',
    update: 'The link could not be updated',
    delete: 'The link could not be deleted',
    activate: 'The link could not be activated',
    deactivate: 'The link could not be deactivated',
    list: 'The links could not be loaded',
  },
};

export const FOOTER_SOCIAL_SUCCESS_FEEDBACK: Localized<FooterSuccessFeedback> = {
  es: {
    create: { heading: 'Red social agregada', message: (name) => `"${name}" se agregó al pie de página.` },
    update: { heading: 'Red social actualizada', message: (name) => `Se guardaron los cambios de "${name}".` },
    delete: { heading: 'Red social eliminada', message: (name) => `"${name}" ya no aparece en el pie de página.` },
    activate: { heading: 'Red social activada', message: (name) => `"${name}" vuelve a verse en el pie de página.` },
    deactivate: { heading: 'Red social inactivada', message: (name) => `"${name}" dejó de verse en el pie de página.` },
  },
  en: {
    create: { heading: 'Social link added', message: (name) => `"${name}" was added to the footer.` },
    update: { heading: 'Social link updated', message: (name) => `The changes to "${name}" were saved.` },
    delete: { heading: 'Social link deleted', message: (name) => `"${name}" no longer appears in the footer.` },
    activate: { heading: 'Social link activated', message: (name) => `"${name}" shows in the footer again.` },
    deactivate: { heading: 'Social link deactivated', message: (name) => `"${name}" no longer shows in the footer.` },
  },
};

export const FOOTER_SOCIAL_ERROR_HEADINGS: Localized<FooterErrorHeadings> = {
  es: {
    create: 'No se pudo agregar la red social',
    update: 'No se pudo actualizar la red social',
    delete: 'No se pudo eliminar la red social',
    activate: 'No se pudo activar la red social',
    deactivate: 'No se pudo inactivar la red social',
    list: 'No se pudieron cargar las redes sociales',
  },
  en: {
    create: 'The social link could not be added',
    update: 'The social link could not be updated',
    delete: 'The social link could not be deleted',
    activate: 'The social link could not be activated',
    deactivate: 'The social link could not be deactivated',
    list: 'The social links could not be loaded',
  },
};

export interface GameFeedbackTexts {
  readonly settingsUpdated: string;
  readonly settingsUpdateError: string;
  readonly settingsLoadError: string;
  readonly themeUpdated: (name: string) => string;
  readonly themeUpdateError: string;
  readonly themesLoadError: string;
}

export const GAME_FEEDBACK_TEXTS: Localized<GameFeedbackTexts> = {
  es: {
    settingsUpdated: 'Se guardó la visibilidad del minijuego.',
    settingsUpdateError: 'No se pudo actualizar la visibilidad del minijuego',
    settingsLoadError: 'No se pudo cargar la configuración del minijuego',
    themeUpdated: (name) => `Se guardaron los cambios del modo "${name}".`,
    themeUpdateError: 'No se pudo actualizar el modo del minijuego',
    themesLoadError: 'No se pudieron cargar los modos del minijuego',
  },
  en: {
    settingsUpdated: 'The minigame visibility was saved.',
    settingsUpdateError: 'The minigame visibility could not be updated',
    settingsLoadError: 'The minigame settings could not be loaded',
    themeUpdated: (name) => `The changes to the "${name}" mode were saved.`,
    themeUpdateError: 'The minigame mode could not be updated',
    themesLoadError: 'The minigame modes could not be loaded',
  },
};
