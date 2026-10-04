import { Component, computed, effect, inject, model, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LanguageService } from '../../../../../../core/public/services/language.service';
import { localized } from '../../../../../../shared/utils/localized';
import { AdDialog } from '../../../../../../shared/private/components/ad-dialog/ad-dialog';
import { AdNumberField } from '../../../../../../shared/private/components/ad-number-field/ad-number-field';
import { AdSelect } from '../../../../../../shared/private/components/ad-select/ad-select';
import { AdTextField } from '../../../../../../shared/private/components/ad-text-field/ad-text-field';
import { AdOption } from '../../../../../../shared/private/interfaces/ad-option.interface';
import {
  SOCIAL_PLATFORM_VALUE_HINT,
  SOCIAL_PLATFORM_VALUE_LABEL,
} from '../../../constants/footer/social-platform.constants';
import { SaveSocialLinkRequest } from '../../../interfaces/footer/footer-request.interface';
import { SocialLink, SocialPlatformOption } from '../../../interfaces/footer/footer.interface';

export interface SocialLinkFormTexts {
  readonly createHeading: string;
  readonly editHeading: string;
  readonly platform: string;
  readonly sortOrder: string;
  readonly required: string;
}

const TEXTS: Record<'es' | 'en', SocialLinkFormTexts> = {
  es: {
    createHeading: 'Nueva red social',
    editHeading: 'Editar red social',
    platform: 'Red',
    sortOrder: 'Orden',
    required: 'Este campo es obligatorio.',
  },
  en: {
    createHeading: 'New social link',
    editHeading: 'Edit social link',
    platform: 'Platform',
    sortOrder: 'Order',
    required: 'This field is required.',
  },
};

@Component({
  selector: 'ad-social-link-form-dialog',
  imports: [ReactiveFormsModule, AdDialog, AdSelect, AdTextField, AdNumberField],
  templateUrl: './social-link-form-dialog.html',
  styleUrl: './social-link-form-dialog.scss',
})
export class SocialLinkFormDialog {
  readonly open = model(false);
  readonly link = model<SocialLink | null>(null);
  readonly platformOptions = model<readonly SocialPlatformOption[]>([]);
  readonly usedCatalogIds = model<readonly number[]>([]);

  readonly saved = output<SaveSocialLinkRequest>();

  private readonly language = inject(LanguageService).language;

  protected readonly valueLabel = localized(SOCIAL_PLATFORM_VALUE_LABEL);
  protected readonly valueHint = localized(SOCIAL_PLATFORM_VALUE_HINT);
  protected readonly texts = localized({ es: TEXTS.es, en: TEXTS.en });

  protected readonly heading = computed(() =>
    this.link() ? this.texts().editHeading : this.texts().createHeading,
  );

  protected readonly selectOptions = computed<readonly AdOption[]>(() => {
    const current = this.link()?.catalogId;
    const used = new Set(this.usedCatalogIds());
    const language = this.language();
    return this.platformOptions().map((option) => ({
      value: option.id,
      label: language === 'en' ? option.nameEn : option.nameEs,
      disabled: used.has(option.id) && option.id !== current,
    }));
  });

  protected readonly form = new FormGroup({
    catalogId: new FormControl<number | null>(null, Validators.required),
    value: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(300)] }),
    sortOrder: new FormControl<number | null>(0, Validators.min(0)),
  });

  constructor() {
    effect(() => {
      if (this.open()) {
        const link = this.link();
        this.form.reset({
          catalogId: link?.catalogId ?? null,
          value: link?.value ?? '',
          sortOrder: link?.sortOrder ?? 0,
        });
      }
    });
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const value = this.form.getRawValue();
    this.saved.emit({
      catalogId: value.catalogId!,
      value: value.value.trim(),
      sortOrder: value.sortOrder ?? 0,
    });
  }
}
