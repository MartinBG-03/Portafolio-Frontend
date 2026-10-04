import type { AdIconName } from '../components/ad-icon/ad-icon-registry';

export type AdMenuItemTone = 'default' | 'danger';

export interface AdMenuItem {
  readonly key: string;
  readonly label: string;
  readonly icon?: AdIconName;
  readonly tone?: AdMenuItemTone;
  readonly disabled?: boolean;
}
