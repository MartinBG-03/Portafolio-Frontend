import { Component } from '@angular/core';
import { AD_NAVIGATION_TEXTS } from '../../../../../core/private/i18n/ad-navigation-texts';
import { localized } from '../../../../../shared/utils/localized';
import { AdPageHeader } from '../../../../../shared/private/components/ad-page-header/ad-page-header';

@Component({
  selector: 'ad-site-home-page',
  imports: [AdPageHeader],
  templateUrl: './site-home-page.html',
})
export class SiteHomePage {
  protected readonly texts = localized(AD_NAVIGATION_TEXTS);
}
