import { Localized } from '../../../../../core/public/i18n/language';
import { AdMenuItem } from '../../../../../shared/private/interfaces/ad-menu.interface';

export const FOOTER_ROW_ACTION = {
  edit: 'edit',
  delete: 'delete',
  activate: 'activate',
  deactivate: 'deactivate',
} as const;

export type FooterRowAction = (typeof FOOTER_ROW_ACTION)[keyof typeof FOOTER_ROW_ACTION];

export type FooterConfirmableAction = Exclude<FooterRowAction, 'edit'>;

export type FooterRowActionItems = Readonly<Record<FooterRowAction, AdMenuItem>>;

export const FOOTER_ROW_ACTION_ITEMS: Localized<FooterRowActionItems> = {
  es: {
    edit: { key: FOOTER_ROW_ACTION.edit, label: 'Editar', icon: 'edit' },
    delete: { key: FOOTER_ROW_ACTION.delete, label: 'Eliminar', icon: 'trash', tone: 'danger' },
    deactivate: { key: FOOTER_ROW_ACTION.deactivate, label: 'Inactivar', icon: 'close' },
    activate: { key: FOOTER_ROW_ACTION.activate, label: 'Activar', icon: 'check' },
  },
  en: {
    edit: { key: FOOTER_ROW_ACTION.edit, label: 'Edit', icon: 'edit' },
    delete: { key: FOOTER_ROW_ACTION.delete, label: 'Delete', icon: 'trash', tone: 'danger' },
    deactivate: { key: FOOTER_ROW_ACTION.deactivate, label: 'Deactivate', icon: 'close' },
    activate: { key: FOOTER_ROW_ACTION.activate, label: 'Activate', icon: 'check' },
  },
};

export interface FooterConfirmation {
  readonly heading: string;
  readonly confirmLabel: string;
  readonly tone: 'primary' | 'danger';
  readonly message: (name: string) => string;
}

export const FOOTER_LINK_CONFIRMATIONS: Localized<
  Readonly<Record<FooterConfirmableAction, FooterConfirmation>>
> = {
  es: {
    delete: {
      heading: 'Eliminar enlace',
      confirmLabel: 'Eliminar',
      tone: 'danger',
      message: (name) => `¿Seguro que deseas eliminar el enlace a "${name}"?`,
    },
    deactivate: {
      heading: 'Inactivar enlace',
      confirmLabel: 'Inactivar',
      tone: 'danger',
      message: (name) => `¿Deseas inactivar el enlace a "${name}"? Dejará de verse en el pie de página.`,
    },
    activate: {
      heading: 'Activar enlace',
      confirmLabel: 'Activar',
      tone: 'primary',
      message: (name) => `¿Deseas activar el enlace a "${name}"? Volverá a verse en el pie de página.`,
    },
  },
  en: {
    delete: {
      heading: 'Delete link',
      confirmLabel: 'Delete',
      tone: 'danger',
      message: (name) => `Are you sure you want to delete the link to "${name}"?`,
    },
    deactivate: {
      heading: 'Deactivate link',
      confirmLabel: 'Deactivate',
      tone: 'danger',
      message: (name) => `Do you want to deactivate the link to "${name}"? It will no longer show in the footer.`,
    },
    activate: {
      heading: 'Activate link',
      confirmLabel: 'Activate',
      tone: 'primary',
      message: (name) => `Do you want to activate the link to "${name}"? It will show in the footer again.`,
    },
  },
};

export const FOOTER_SOCIAL_CONFIRMATIONS: Localized<
  Readonly<Record<FooterConfirmableAction, FooterConfirmation>>
> = {
  es: {
    delete: {
      heading: 'Eliminar red social',
      confirmLabel: 'Eliminar',
      tone: 'danger',
      message: (name) => `¿Seguro que deseas eliminar "${name}"?`,
    },
    deactivate: {
      heading: 'Inactivar red social',
      confirmLabel: 'Inactivar',
      tone: 'danger',
      message: (name) => `¿Deseas inactivar "${name}"? Dejará de verse en el pie de página.`,
    },
    activate: {
      heading: 'Activar red social',
      confirmLabel: 'Activar',
      tone: 'primary',
      message: (name) => `¿Deseas activar "${name}"? Volverá a verse en el pie de página.`,
    },
  },
  en: {
    delete: {
      heading: 'Delete social link',
      confirmLabel: 'Delete',
      tone: 'danger',
      message: (name) => `Are you sure you want to delete "${name}"?`,
    },
    deactivate: {
      heading: 'Deactivate social link',
      confirmLabel: 'Deactivate',
      tone: 'danger',
      message: (name) => `Do you want to deactivate "${name}"? It will no longer show in the footer.`,
    },
    activate: {
      heading: 'Activate social link',
      confirmLabel: 'Activate',
      tone: 'primary',
      message: (name) => `Do you want to activate "${name}"? It will show in the footer again.`,
    },
  },
};
