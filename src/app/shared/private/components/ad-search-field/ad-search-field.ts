import { Component, computed, forwardRef, input, output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { localized } from '../../../utils/localized';
import { AD_FIELD_TEXTS } from '../../constants/ad-texts.constants';
import { AdControlAccessor } from '../ad-form-field/ad-field-control';
import { AdIcon } from '../ad-icon/ad-icon';
import { AdIconButton } from '../ad-icon-button/ad-icon-button';

@Component({
  selector: 'ad-search-field',
  imports: [AdIcon, AdIconButton],
  templateUrl: './ad-search-field.html',
  styleUrl: './ad-search-field.scss',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AdSearchField), multi: true },
  ],
})
export class AdSearchField extends AdControlAccessor<string> {
  readonly label = input.required<string>();
  readonly placeholder = input<string>();
  readonly clearLabel = input<string>();

  readonly submitted = output<string>();

  private readonly texts = localized(AD_FIELD_TEXTS);

  protected readonly placeholderText = computed(
    () => this.placeholder() ?? this.texts().searchPlaceholder,
  );
  protected readonly clearText = computed(() => this.clearLabel() ?? this.texts().clearSearch);

  protected onInput(event: Event): void {
    this.commit((event.target as HTMLInputElement).value);
  }

  protected clear(): void {
    this.commit('');
  }

  protected onSubmit(): void {
    this.submitted.emit(this.value() ?? '');
  }
}
