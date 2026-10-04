import { Component } from '@angular/core';
import { AD_NAVIGATION_TEXTS } from '../../../../../core/private/i18n/ad-navigation-texts';
import { localized } from '../../../../../shared/utils/localized';
import { AdPageHeader } from '../../../../../shared/private/components/ad-page-header/ad-page-header';

@Component({
  selector: 'ad-book-management-page',
  imports: [AdPageHeader],
  templateUrl: './book-management-page.html',
})
export class BookManagementPage {
  protected readonly texts = localized(AD_NAVIGATION_TEXTS);
}
