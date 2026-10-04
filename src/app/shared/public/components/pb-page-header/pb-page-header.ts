import { booleanAttribute, Component, input } from '@angular/core';
import { Icon } from '../../../components/icon/icon';
import { IconName } from '../../../components/icon/icon-registry';
import { BreadcrumbItem } from '../../interfaces/breadcrumb-item.interface';
import { PbBreadcrumbs } from '../pb-breadcrumbs/pb-breadcrumbs';

@Component({
  selector: 'pb-page-header',
  imports: [PbBreadcrumbs, Icon],
  templateUrl: './pb-page-header.html',
  styleUrl: './pb-page-header.scss',
})
export class PbPageHeader {
  readonly heading = input.required<string>();
  readonly headingLevel = input<1 | 2>(1);
  readonly description = input<string>();
  readonly wideDescription = input(false, { transform: booleanAttribute });
  readonly breadcrumbs = input<readonly BreadcrumbItem[]>([]);
  readonly icon = input<IconName>();
}
