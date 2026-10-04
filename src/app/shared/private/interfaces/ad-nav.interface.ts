import { AdNavKey } from '../../../core/private/i18n/ad-navigation-texts';
import { AdIconName } from '../components/ad-icon/ad-icon-registry';

export interface AdNavLink {
  readonly key: AdNavKey;
  readonly path: string;
  readonly icon?: AdIconName;
}

export interface AdNavModule extends AdNavLink {
  readonly children?: readonly AdNavLink[];
}
