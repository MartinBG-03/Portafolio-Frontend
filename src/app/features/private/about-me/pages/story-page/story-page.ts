import { Component } from '@angular/core';
import { AD_NAVIGATION_TEXTS } from '../../../../../core/private/i18n/ad-navigation-texts';
import { localized } from '../../../../../shared/utils/localized';
import { AdPageHeader } from '../../../../../shared/private/components/ad-page-header/ad-page-header';

@Component({
  selector: 'ad-story-page',
  imports: [AdPageHeader],
  templateUrl: './story-page.html',
})
export class StoryPage {
  protected readonly texts = localized(AD_NAVIGATION_TEXTS);
}
