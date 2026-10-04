import { Component } from '@angular/core';
import { AD_NAVIGATION_TEXTS } from '../../../../../core/private/i18n/ad-navigation-texts';
import { localized } from '../../../../../shared/utils/localized';
import { AdPageHeader } from '../../../../../shared/private/components/ad-page-header/ad-page-header';

@Component({
  selector: 'ad-messaging-page',
  imports: [AdPageHeader],
  templateUrl: './messaging-page.html',
})
export class MessagingPage {
  protected readonly texts = localized(AD_NAVIGATION_TEXTS);
}
