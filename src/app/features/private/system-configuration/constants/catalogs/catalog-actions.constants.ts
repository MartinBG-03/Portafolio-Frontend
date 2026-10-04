import { Localized } from '../../../../../core/public/i18n/language';
import { AdMenuItem } from '../../../../../shared/private/interfaces/ad-menu.interface';

export const CATALOG_ROW_ACTION = {
  edit: 'edit',
  delete: 'delete',
  activate: 'activate',
  deactivate: 'deactivate',
} as const;

export type CatalogRowAction = (typeof CATALOG_ROW_ACTION)[keyof typeof CATALOG_ROW_ACTION];

export type CatalogConfirmableAction = Exclude<CatalogRowAction, 'edit'>;

export type CatalogRowActionItems = Readonly<Record<CatalogRowAction, AdMenuItem>>;

export const CATALOG_ROW_ACTION_ITEMS: Localized<CatalogRowActionItems> = {
  es: {
    edit: { key: CATALOG_ROW_ACTION.edit, label: 'Editar', icon: 'edit' },
    delete: { key: CATALOG_ROW_ACTION.delete, label: 'Eliminar', icon: 'trash', tone: 'danger' },
    deactivate: { key: CATALOG_ROW_ACTION.deactivate, label: 'Inactivar', icon: 'close' },
    activate: { key: CATALOG_ROW_ACTION.activate, label: 'Activar', icon: 'check' },
  },
  en: {
    edit: { key: CATALOG_ROW_ACTION.edit, label: 'Edit', icon: 'edit' },
    delete: { key: CATALOG_ROW_ACTION.delete, label: 'Delete', icon: 'trash', tone: 'danger' },
    deactivate: { key: CATALOG_ROW_ACTION.deactivate, label: 'Deactivate', icon: 'close' },
    activate: { key: CATALOG_ROW_ACTION.activate, label: 'Activate', icon: 'check' },
  },
};

export interface CatalogConfirmation {
  readonly heading: string;
  readonly confirmLabel: string;
  readonly tone: 'primary' | 'danger';
  readonly message: (name: string) => string;
}

export const CATALOG_CONFIRMATIONS: Localized<
  Readonly<Record<CatalogConfirmableAction, CatalogConfirmation>>
> = {
  es: {
    delete: {
      heading: 'Eliminar catálogo',
      confirmLabel: 'Eliminar',
      tone: 'danger',
      message: (name) => `¿Seguro que deseas eliminar "${name}"? Esta acción no se puede deshacer.`,
    },
    deactivate: {
      heading: 'Inactivar catálogo',
      confirmLabel: 'Inactivar',
      tone: 'danger',
      message: (name) =>
        `¿Deseas inactivar "${name}"? Dejará de estar disponible mientras permanezca inactivo.`,
    },
    activate: {
      heading: 'Activar catálogo',
      confirmLabel: 'Activar',
      tone: 'primary',
      message: (name) => `¿Deseas activar "${name}"? Volverá a estar disponible en el sistema.`,
    },
  },
  en: {
    delete: {
      heading: 'Delete catalog',
      confirmLabel: 'Delete',
      tone: 'danger',
      message: (name) => `Are you sure you want to delete "${name}"? This action cannot be undone.`,
    },
    deactivate: {
      heading: 'Deactivate catalog',
      confirmLabel: 'Deactivate',
      tone: 'danger',
      message: (name) =>
        `Do you want to deactivate "${name}"? It will stop being available while it stays inactive.`,
    },
    activate: {
      heading: 'Activate catalog',
      confirmLabel: 'Activate',
      tone: 'primary',
      message: (name) =>
        `Do you want to activate "${name}"? It will be available in the system again.`,
    },
  },
};
