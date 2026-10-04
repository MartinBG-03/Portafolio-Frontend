import { Component } from '@angular/core';
import { AD_NAVIGATION_TEXTS } from '../../../../../core/private/i18n/ad-navigation-texts';
import { localized } from '../../../../../shared/utils/localized';
import { AdPageHeader } from '../../../../../shared/private/components/ad-page-header/ad-page-header';

@Component({
  selector: 'ad-resume-page',
  imports: [AdPageHeader],
  templateUrl: './resume-page.html',
})
export class ResumePage {
  protected readonly texts = localized(AD_NAVIGATION_TEXTS);
}
