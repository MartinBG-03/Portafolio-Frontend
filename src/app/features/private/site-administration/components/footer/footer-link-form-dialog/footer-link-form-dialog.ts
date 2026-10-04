import { Component, computed, effect, model, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { localized } from '../../../../../../shared/utils/localized';
import { AdDialog } from '../../../../../../shared/private/components/ad-dialog/ad-dialog';
import { AdNumberField } from '../../../../../../shared/private/components/ad-number-field/ad-number-field';
import { AdSelect } from '../../../../../../shared/private/components/ad-select/ad-select';
import { AdOption } from '../../../../../../shared/private/interfaces/ad-option.interface';
import { ALL_ROUTE_KEYS, ROUTE_KEY_TEXTS } from '../../../constants/footer/route-key.constants';
import { SaveFooterLinkRequest } from '../../../interfaces/footer/footer-request.interface';
import { FooterLink, PublicRouteKey } from '../../../interfaces/footer/footer.interface';

export interface FooterLinkFormTexts {
  readonly createHeading: string;
  readonly editHeading: string;
  readonly routeKey: string;
  readonly sortOrder: string;
  readonly required: string;
}

const TEXTS: Record<'es' | 'en', FooterLinkFormTexts> = {
  es: {
    createHeading: 'Nuevo enlace del pie de página',
    editHeading: 'Editar enlace',
    routeKey: 'Página pública',
    sortOrder: 'Orden',
    required: 'Este campo es obligatorio.',
  },
  en: {
    createHeading: 'New footer link',
    editHeading: 'Edit link',
    routeKey: 'Public page',
    sortOrder: 'Order',
    required: 'This field is required.',
  },
};

@Component({
  selector: 'ad-footer-link-form-dialog',
  imports: [ReactiveFormsModule, AdDialog, AdSelect, AdNumberField],
  templateUrl: './footer-link-form-dialog.html',
  styleUrl: './footer-link-form-dialog.scss',
})
export class FooterLinkFormDialog {
  readonly open = model(false);
  readonly link = model<FooterLink | null>(null);
  readonly usedRouteKeys = model<readonly PublicRouteKey[]>([]);

  readonly saved = output<SaveFooterLinkRequest>();

  private readonly routeKeyTexts = localized(ROUTE_KEY_TEXTS);

  protected readonly texts = localized({ es: TEXTS.es, en: TEXTS.en });

  protected readonly heading = computed(() =>
    this.link() ? this.texts().editHeading : this.texts().createHeading,
  );

  protected readonly routeOptions = computed<readonly AdOption[]>(() => {
    const labels = this.routeKeyTexts();
    const current = this.link()?.routeKey;
    const used = new Set(this.usedRouteKeys());
    return ALL_ROUTE_KEYS.map((key) => ({
      value: key,
      label: labels[key],
      disabled: used.has(key) && key !== current,
    }));
  });

  protected readonly form = new FormGroup({
    routeKey: new FormControl<PublicRouteKey | null>(null, Validators.required),
    sortOrder: new FormControl<number | null>(0, Validators.min(0)),
  });

  constructor() {
    effect(() => {
      if (this.open()) {
        const link = this.link();
        this.form.reset({
          routeKey: link?.routeKey ?? null,
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
    this.saved.emit({ routeKey: value.routeKey!, sortOrder: value.sortOrder ?? 0 });
  }
}
