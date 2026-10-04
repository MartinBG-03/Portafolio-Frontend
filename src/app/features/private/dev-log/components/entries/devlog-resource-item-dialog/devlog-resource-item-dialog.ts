import { Component, effect, model, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { localized } from '../../../../../../shared/utils/localized';
import { AdDialog } from '../../../../../../shared/private/components/ad-dialog/ad-dialog';
import { AdFormRow } from '../../../../../../shared/private/components/ad-form-row/ad-form-row';
import { AdTextField } from '../../../../../../shared/private/components/ad-text-field/ad-text-field';
import { AdTextareaField } from '../../../../../../shared/private/components/ad-textarea-field/ad-textarea-field';
import {
  DEVLOG_ENTRY_FORM_MESSAGES,
  DEVLOG_ENTRY_LIMITS,
  DEVLOG_RESOURCE_ITEM_FORM_TEXTS,
} from '../../../constants/entries/devlog-entry-form.constants';

export interface DevLogResourceItemDetail {
  readonly titleEs: string;
  readonly titleEn: string;
  readonly bodyEs: string | null;
  readonly bodyEn: string | null;
}

type DevLogResourceItemField = 'titleEs' | 'titleEn' | 'bodyEs' | 'bodyEn';

@Component({
  selector: 'ad-devlog-resource-item-dialog',
  imports: [ReactiveFormsModule, AdDialog, AdFormRow, AdTextField, AdTextareaField],
  templateUrl: './devlog-resource-item-dialog.html',
  styleUrl: './devlog-resource-item-dialog.scss',
})
export class DevlogResourceItemDialog {
  readonly open = model(false);

  readonly saved = output<DevLogResourceItemDetail>();

  protected readonly texts = localized(DEVLOG_RESOURCE_ITEM_FORM_TEXTS);
  private readonly messages = localized(DEVLOG_ENTRY_FORM_MESSAGES);
  protected readonly limits = DEVLOG_ENTRY_LIMITS;

  protected readonly form = new FormGroup({
    titleEs: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(DEVLOG_ENTRY_LIMITS.mediaTitleMaxLength)],
    }),
    titleEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(DEVLOG_ENTRY_LIMITS.mediaTitleMaxLength)],
    }),
    bodyEs: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(DEVLOG_ENTRY_LIMITS.mediaBodyMaxLength)],
    }),
    bodyEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(DEVLOG_ENTRY_LIMITS.mediaBodyMaxLength)],
    }),
  });

  private readonly submitted = signal(false);

  constructor() {
    effect(() => {
      if (this.open()) {
        this.reset();
      }
    });
  }

  protected errorOf(field: DevLogResourceItemField): string | null {
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
    return null;
  }

  protected submit(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    this.open.set(false);
    this.saved.emit({
      titleEs: value.titleEs.trim(),
      titleEn: value.titleEn.trim(),
      bodyEs: value.bodyEs.trim() || null,
      bodyEn: value.bodyEn.trim() || null,
    });
  }

  private reset(): void {
    this.submitted.set(false);
    this.form.reset({ titleEs: '', titleEn: '', bodyEs: '', bodyEn: '' });
  }
}
