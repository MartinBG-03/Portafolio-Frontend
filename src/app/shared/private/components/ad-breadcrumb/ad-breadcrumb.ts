import { Component, computed, input } from '@angular/core';
import { localized } from '../../../utils/localized';
import { AD_FIELD_TEXTS } from '../../constants/ad-texts.constants';

@Component({
  selector: 'ad-breadcrumb',
  templateUrl: './ad-breadcrumb.html',
  styleUrl: './ad-breadcrumb.scss',
})
export class AdBreadcrumb {
  readonly items = input.required<readonly string[]>();
  readonly label = input<string>();
  readonly separator = input('›');

  private readonly texts = localized(AD_FIELD_TEXTS);

  protected readonly labelText = computed(() => this.label() ?? this.texts().breadcrumb);
}
