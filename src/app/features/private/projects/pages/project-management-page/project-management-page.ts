import { Component } from '@angular/core';
import { AD_NAVIGATION_TEXTS } from '../../../../../core/private/i18n/ad-navigation-texts';
import { localized } from '../../../../../shared/utils/localized';
import { AdPageHeader } from '../../../../../shared/private/components/ad-page-header/ad-page-header';

@Component({
  selector: 'ad-project-management-page',
  imports: [AdPageHeader],
  templateUrl: './project-management-page.html',
})
export class ProjectManagementPage {
  protected readonly texts = localized(AD_NAVIGATION_TEXTS);
}
