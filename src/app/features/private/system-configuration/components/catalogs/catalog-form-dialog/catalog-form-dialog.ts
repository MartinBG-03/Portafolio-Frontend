import { Component, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LanguageService } from '../../../../../../core/public/services/language.service';
import { localized } from '../../../../../../shared/utils/localized';
import { AdBreadcrumb } from '../../../../../../shared/private/components/ad-breadcrumb/ad-breadcrumb';
import { AdDialog } from '../../../../../../shared/private/components/ad-dialog/ad-dialog';
import { AdFormRow } from '../../../../../../shared/private/components/ad-form-row/ad-form-row';
import { AdFormSection } from '../../../../../../shared/private/components/ad-form-section/ad-form-section';
import { AdNumberField } from '../../../../../../shared/private/components/ad-number-field/ad-number-field';
import { AdSwitch } from '../../../../../../shared/private/components/ad-switch/ad-switch';
import { AdTextField } from '../../../../../../shared/private/components/ad-text-field/ad-text-field';
import { AdTextareaField } from '../../../../../../shared/private/components/ad-textarea-field/ad-textarea-field';
import {
  CATALOG_FORM_MESSAGES,
  CATALOG_FORM_TEXTS,
  CATALOG_LIMITS,
} from '../../../constants/catalogs/catalog-form.constants';
import { CreateCatalogRequest } from '../../../interfaces/catalogs/catalog-request.interface';
import { Catalog } from '../../../interfaces/catalogs/catalog.interface';
import { catalogName } from '../../../utils/catalogs/catalog-name';

type CatalogFormField =
  'code' | 'nameEs' | 'nameEn' | 'descriptionEs' | 'descriptionEn' | 'sortOrder';

@Component({
  selector: 'ad-catalog-form-dialog',
  imports: [
    ReactiveFormsModule,
    AdDialog,
    AdBreadcrumb,
    AdFormSection,
    AdFormRow,
    AdTextField,
    AdTextareaField,
    AdNumberField,
    AdSwitch,
  ],
  templateUrl: './catalog-form-dialog.html',
  styleUrl: './catalog-form-dialog.scss',
})
export class CatalogFormDialog {
  readonly open = model(false);
  readonly catalog = input<Catalog | null>(null);
  readonly parent = input<Catalog | null>(null);
  readonly path = input<readonly string[]>([]);

  readonly saved = output<CreateCatalogRequest>();

  private readonly language = inject(LanguageService).language;
  private readonly messages = localized(CATALOG_FORM_MESSAGES);

  protected readonly texts = localized(CATALOG_FORM_TEXTS);
  protected readonly limits = CATALOG_LIMITS;

  protected readonly heading = computed(() => {
    const texts = this.texts();
    const isChild = this.parent() !== null;
    if (this.catalog() !== null) {
      return isChild ? texts.editChild : texts.editRoot;
    }
    return isChild ? texts.createChild : texts.createRoot;
  });

  protected readonly crumbs = computed(() => [
    this.texts().rootCrumb,
    ...this.path(),
    this.catalogLabel(),
  ]);

  protected readonly form = new FormGroup({
    parentName: new FormControl({ value: '', disabled: true }, { nonNullable: true }),
    code: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(CATALOG_LIMITS.codeMaxLength)],
    }),
    nameEs: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(CATALOG_LIMITS.nameMaxLength)],
    }),
    nameEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(CATALOG_LIMITS.nameMaxLength)],
    }),
    descriptionEs: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(CATALOG_LIMITS.descriptionMaxLength)],
    }),
    descriptionEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(CATALOG_LIMITS.descriptionMaxLength)],
    }),
    sortOrder: new FormControl<number | null>(0, [Validators.min(0)]),
    isSystemCatalog: new FormControl(false, { nonNullable: true }),
  });

  protected readonly isExistingSystemCatalog = computed(() => this.catalog()?.isSystemCatalog === true);

  private readonly codeValue = toSignal(this.form.controls.code.valueChanges, {
    initialValue: this.form.controls.code.value,
  });

  protected readonly codeHint = computed(() =>
    this.texts().codeHint(this.codeValue().length, CATALOG_LIMITS.codeMaxLength),
  );

  private readonly submitted = signal(false);

  constructor() {
    effect(() => {
      if (this.open()) {
        this.reset(this.catalog(), this.parent());
      }
    });
  }

  protected errorOf(field: CatalogFormField): string | null {
    const control = this.form.controls[field];
    if (control.valid || !(control.touched || this.submitted())) {
      return null;
    }
    if (control.hasError('required')) {
      return this.messages().required;
    }
    if (control.hasError('maxlength')) {
      return this.messages().maxLength(control.getError('maxlength').requiredLength);
    }
    if (control.hasError('min')) {
      return this.messages().min(control.getError('min').min);
    }
    return null;
  }

  protected submit(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.saved.emit(this.toRequest());
  }

  private catalogLabel(): string {
    const catalog = this.catalog();
    return catalog ? catalogName(catalog, this.language()) : this.texts().newCrumb;
  }

  private reset(catalog: Catalog | null, parent: Catalog | null): void {
    this.submitted.set(false);
    this.form.reset({
      parentName: parent ? catalogName(parent, this.language()) : '',
      code: catalog?.code ?? '',
      nameEs: catalog?.nameEs ?? '',
      nameEn: catalog?.nameEn ?? '',
      descriptionEs: catalog?.descriptionEs ?? '',
      descriptionEn: catalog?.descriptionEn ?? '',
      sortOrder: catalog?.sortOrder ?? 0,
      isSystemCatalog: catalog?.isSystemCatalog ?? false,
    });

    if (catalog?.isSystemCatalog) {
      this.form.controls.code.disable();
    } else {
      this.form.controls.code.enable();
    }
  }

  private toRequest(): CreateCatalogRequest {
    const value = this.form.getRawValue();
    return {
      parentId: this.parent()?.id ?? null,
      code: value.code.trim(),
      nameEs: value.nameEs.trim(),
      nameEn: value.nameEn.trim(),
      descriptionEs: value.descriptionEs.trim() || null,
      descriptionEn: value.descriptionEn.trim() || null,
      sortOrder: value.sortOrder ?? 0,
      isSystemCatalog: value.isSystemCatalog,
    };
  }
}
