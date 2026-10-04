import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { localized } from '../../../utils/localized';
import { AD_FIELD_TEXTS } from '../../constants/ad-texts.constants';
import { AdFieldControl } from '../ad-form-field/ad-field-control';
import { AdFormField } from '../ad-form-field/ad-form-field';
import { AdIcon } from '../ad-icon/ad-icon';
import { AdIconButton } from '../ad-icon-button/ad-icon-button';

export type AdTextFieldType = 'text' | 'email' | 'tel' | 'url' | 'password';

@Component({
  selector: 'ad-text-field',
  imports: [AdFormField, AdIcon, AdIconButton],
  templateUrl: './ad-text-field.html',
  styleUrl: './ad-text-field.scss',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AdTextField), multi: true },
  ],
})
export class AdTextField extends AdFieldControl<string> {
  readonly type = input<AdTextFieldType>('text');
  readonly autocomplete = input<string>('off');
  readonly prefix = input<string>();
  readonly revealLabel = input<string>();
  readonly hideLabel = input<string>();

  private readonly texts = localized(AD_FIELD_TEXTS);

  protected readonly revealed = signal(false);
  protected readonly isPassword = computed(() => this.type() === 'password');
  protected readonly resolvedType = computed(() =>
    this.isPassword() ? (this.revealed() ? 'text' : 'password') : this.type(),
  );
  protected readonly resolvedRevealLabel = computed(() => this.revealLabel() ?? this.texts().showPassword);
  protected readonly resolvedHideLabel = computed(() => this.hideLabel() ?? this.texts().hidePassword);

  protected onInput(event: Event): void {
    this.commit((event.target as HTMLInputElement).value);
  }

  protected toggleReveal(): void {
    this.revealed.update((value) => !value);
  }
}
