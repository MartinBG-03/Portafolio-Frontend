import { Localized } from '../../../../../core/public/i18n/language';
import { AdMenuItem } from '../../../../../shared/private/interfaces/ad-menu.interface';

export const DEVLOG_ENTRY_ROW_ACTION = {
  feature: 'feature',
  edit: 'edit',
  delete: 'delete',
  activate: 'activate',
  deactivate: 'deactivate',
} as const;

export type DevLogEntryRowAction =
  (typeof DEVLOG_ENTRY_ROW_ACTION)[keyof typeof DEVLOG_ENTRY_ROW_ACTION];

export type DevLogEntryConfirmableAction = Exclude<DevLogEntryRowAction, 'edit'>;

export type DevLogEntryRowActionItems = Readonly<Record<DevLogEntryRowAction, AdMenuItem>>;

export const DEVLOG_ENTRY_ROW_ACTION_ITEMS: Localized<DevLogEntryRowActionItems> = {
  es: {
    feature: { key: DEVLOG_ENTRY_ROW_ACTION.feature, label: 'Colocar como destacada', icon: 'star' },
    edit: { key: DEVLOG_ENTRY_ROW_ACTION.edit, label: 'Editar', icon: 'edit' },
    delete: {
      key: DEVLOG_ENTRY_ROW_ACTION.delete,
      label: 'Eliminar',
      icon: 'trash',
      tone: 'danger',
    },
    deactivate: { key: DEVLOG_ENTRY_ROW_ACTION.deactivate, label: 'Inactivar', icon: 'close' },
    activate: { key: DEVLOG_ENTRY_ROW_ACTION.activate, label: 'Activar', icon: 'check' },
  },
  en: {
    feature: { key: DEVLOG_ENTRY_ROW_ACTION.feature, label: 'Set as featured', icon: 'star' },
    edit: { key: DEVLOG_ENTRY_ROW_ACTION.edit, label: 'Edit', icon: 'edit' },
    delete: {
      key: DEVLOG_ENTRY_ROW_ACTION.delete,
      label: 'Delete',
      icon: 'trash',
      tone: 'danger',
    },
    deactivate: { key: DEVLOG_ENTRY_ROW_ACTION.deactivate, label: 'Deactivate', icon: 'close' },
    activate: { key: DEVLOG_ENTRY_ROW_ACTION.activate, label: 'Activate', icon: 'check' },
  },
};

export interface DevLogEntryConfirmation {
  readonly heading: string;
  readonly confirmLabel: string;
  readonly tone: 'primary' | 'danger';
  readonly message: (name: string) => string;
}

export const DEVLOG_ENTRY_CONFIRMATIONS: Localized<
  Readonly<Record<DevLogEntryConfirmableAction, DevLogEntryConfirmation>>
> = {
  es: {
    feature: {
      heading: 'Cambiar entrada destacada',
      confirmLabel: 'Colocar como destacada',
      tone: 'primary',
      message: (currentName) =>
        `La entrada destacada actual es "${currentName}". ¿Seguro que deseas que esta sea la nueva entrada destacada?`,
    },
    delete: {
      heading: 'Eliminar entrada',
      confirmLabel: 'Eliminar',
      tone: 'danger',
      message: (name) => `¿Seguro que deseas eliminar "${name}"? Esta acción no se puede deshacer.`,
    },
    deactivate: {
      heading: 'Inactivar entrada',
      confirmLabel: 'Inactivar',
      tone: 'danger',
      message: (name) =>
        `¿Deseas inactivar "${name}"? Dejará de estar disponible mientras permanezca inactiva.`,
    },
    activate: {
      heading: 'Activar entrada',
      confirmLabel: 'Activar',
      tone: 'primary',
      message: (name) => `¿Deseas activar "${name}"? Volverá a estar disponible en el sitio público.`,
    },
  },
  en: {
    feature: {
      heading: 'Change featured entry',
      confirmLabel: 'Set as featured',
      tone: 'primary',
      message: (currentName) =>
        `The current featured entry is "${currentName}". Are you sure you want this to be the new featured entry?`,
    },
    delete: {
      heading: 'Delete entry',
      confirmLabel: 'Delete',
      tone: 'danger',
      message: (name) => `Are you sure you want to delete "${name}"? This action cannot be undone.`,
    },
    deactivate: {
      heading: 'Deactivate entry',
      confirmLabel: 'Deactivate',
      tone: 'danger',
      message: (name) =>
        `Do you want to deactivate "${name}"? It will stop being available while it stays inactive.`,
    },
    activate: {
      heading: 'Activate entry',
      confirmLabel: 'Activate',
      tone: 'primary',
      message: (name) => `Do you want to activate "${name}"? It will be available on the public site again.`,
    },
  },
};
