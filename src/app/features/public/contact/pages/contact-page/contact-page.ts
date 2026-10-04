import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LanguageService } from '../../../../../core/public/services/language.service';
import { ToastService } from '../../../../../core/public/services/toast.service';
import { PbButton } from '../../../../../shared/public/components/pb-button/pb-button';
import { PbPageHeader } from '../../../../../shared/public/components/pb-page-header/pb-page-header';
import { PbTextField } from '../../../../../shared/public/components/pb-text-field/pb-text-field';
import { PbTextareaField } from '../../../../../shared/public/components/pb-textarea-field/pb-textarea-field';
import { BreadcrumbItem } from '../../../../../shared/public/interfaces/breadcrumb-item.interface';
import { ContactService } from '../../services/contact.service';

type ContactField = 'name' | 'email' | 'message';

@Component({
  selector: 'pb-contact-page',
  imports: [ReactiveFormsModule, PbPageHeader, PbTextField, PbTextareaField, PbButton],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.scss',
})
export class ContactPage {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly contactService = inject(ContactService);
  private readonly toastService = inject(ToastService);

  protected readonly t = inject(LanguageService).t;
  protected readonly submitting = signal(false);
  private readonly attempted = signal(false);

  protected readonly form = this.formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  protected readonly breadcrumbs = computed<readonly BreadcrumbItem[]>(() => [
    { label: this.t().nav.home, path: '/' },
    { label: this.t().nav.contact },
  ]);

  protected errorFor(field: ContactField): string | null {
    const control = this.form.controls[field];
    if (!control.invalid || !(control.touched || this.attempted())) {
      return null;
    }

    const errors = this.t().contact.errors;
    if (control.hasError('required')) {
      return errors.required;
    }
    if (control.hasError('email')) {
      return errors.email;
    }
    return control.hasError('minlength') ? errors.minLength : null;
  }

  protected async submit(): Promise<void> {
    this.attempted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const messages = this.t().contact.toast;
    this.submitting.set(true);
    try {
      await this.contactService.send(this.form.getRawValue());
      this.toastService.show({
        variant: 'success',
        title: messages.successTitle,
        description: messages.successDescription,
      });
      this.form.reset();
      this.attempted.set(false);
    } catch {
      this.toastService.show({
        variant: 'error',
        title: messages.errorTitle,
        description: messages.errorDescription,
      });
    } finally {
      this.submitting.set(false);
    }
  }
}
