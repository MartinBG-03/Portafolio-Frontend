import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LanguageService } from '../../../../../core/public/services/language.service';
import { ThemeService } from '../../../../../core/public/services/theme.service';
import { localized } from '../../../../../shared/utils/localized';
import { catchApiError } from '../../../../../shared/utils/catch-api-error';
import { ApiResponse } from '../../../../../core/models/api-response.interface';
import { AuthService } from '../../../../../core/private/services/auth.service';
import { SessionExpiredService } from '../../../../../core/private/services/session-expired.service';
import { AdButton } from '../../../../../shared/private/components/ad-button/ad-button';
import { AdConfirmDialog } from '../../../../../shared/private/components/ad-confirm-dialog/ad-confirm-dialog';
import { AdTextField } from '../../../../../shared/private/components/ad-text-field/ad-text-field';
import { AdToastStack } from '../../../../../shared/private/components/ad-toast-stack/ad-toast-stack';
import { AdToastService } from '../../../../../shared/private/services/ad-toast.service';
import { PbLanguageSwitch } from '../../../../../shared/public/components/pb-language-switch/pb-language-switch';
import { PbThemeToggle } from '../../../../../shared/public/components/pb-theme-toggle/pb-theme-toggle';
import { AUTH_TEXTS } from '../../constants/auth-texts.constants';

const LOGO_FOR_LIGHT_MODE = 'images/admin/logos/logo-oscuro.png';
const LOGO_FOR_DARK_MODE = 'images/public/logos/logo-light.png';
const PATTERN_FOR_LIGHT_MODE = 'images/admin/login/pattern-light.webp';
const PATTERN_FOR_DARK_MODE = 'images/admin/login/pattern-dark.webp';
const OTP_CODE_LENGTH = 6;
const DASHBOARD_ROUTE = '/admin/dashboard';

type AuthStep = 'credentials' | 'otp';
type CredentialsField = 'email' | 'password';

@Component({
  selector: 'ad-login',
  imports: [
    ReactiveFormsModule,
    AdTextField,
    AdButton,
    AdConfirmDialog,
    AdToastStack,
    PbLanguageSwitch,
    PbThemeToggle,
  ],
  templateUrl: './ad-login.html',
  styleUrl: './ad-login.scss',
})
export class AdLogin {
  private readonly authService = inject(AuthService);
  private readonly toast = inject(AdToastService);
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly language = inject(LanguageService).language;
  protected readonly sessionExpired = inject(SessionExpiredService);

  protected readonly texts = localized(AUTH_TEXTS);

  protected readonly logo = computed(() =>
    this.themeService.isDark() ? LOGO_FOR_DARK_MODE : LOGO_FOR_LIGHT_MODE,
  );
  protected readonly pattern = computed(() =>
    this.themeService.isDark() ? PATTERN_FOR_DARK_MODE : PATTERN_FOR_LIGHT_MODE,
  );

  protected readonly step = signal<AuthStep>('credentials');
  protected readonly submitting = signal(false);
  protected readonly resending = signal(false);

  protected readonly credentialsForm = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  protected readonly otpControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/^\d{6}$/)],
  });

  private submittedCredentials = false;

  protected errorOf(field: CredentialsField): string | null {
    const control = this.credentialsForm.controls[field];
    if (control.valid || !(control.touched || this.submittedCredentials)) {
      return null;
    }
    if (control.hasError('required')) {
      return this.texts().validation.required;
    }
    if (control.hasError('email')) {
      return this.texts().validation.invalidEmail;
    }
    if (control.hasError('minlength')) {
      return this.texts().validation.passwordTooShort;
    }
    return null;
  }

  protected otpError(): string | null {
    if (this.otpControl.valid || !this.otpControl.touched) {
      return null;
    }
    return this.texts().validation.invalidCode;
  }

  protected submitCredentials(): void {
    this.submittedCredentials = true;
    this.credentialsForm.markAllAsTouched();
    if (this.credentialsForm.invalid || this.submitting()) {
      return;
    }

    this.requestOtp(false);
  }

  protected resendCode(): void {
    if (this.resending()) {
      return;
    }
    this.requestOtp(true);
  }

  protected submitOtp(): void {
    this.otpControl.markAsTouched();
    if (this.otpControl.invalid) {
      return;
    }

    const { email } = this.credentialsForm.getRawValue();
    this.submitting.set(true);
    this.run(this.authService.verifyOtp(email.trim(), this.otpControl.value)).subscribe(
      (response) => {
        this.submitting.set(false);
        if (response.isSuccess) {
          this.router.navigateByUrl(DASHBOARD_ROUTE);
        } else {
          this.toast.error(this.texts().feedback.otpErrorHeading, response.message ?? '');
        }
      },
    );
  }

  protected backToCredentials(): void {
    this.step.set('credentials');
    this.otpControl.reset('');
  }

  protected goToHome(): void {
    this.router.navigate(['/']);
  }

  private requestOtp(isResend: boolean): void {
    const { email, password } = this.credentialsForm.getRawValue();
    const pending = isResend ? this.resending : this.submitting;

    pending.set(true);
    this.run(this.authService.login(email.trim(), password)).subscribe((response) => {
      pending.set(false);
      if (response.isSuccess) {
        this.toast.success(this.texts().feedback.otpSentHeading, this.texts().feedback.otpSentMessage(email));
        this.step.set('otp');
      } else {
        this.toast.error(this.texts().feedback.loginErrorHeading, response.message ?? '');
      }
    });
  }

  private run<T>(request: Observable<ApiResponse<T>>): Observable<ApiResponse<T>> {
    return request.pipe(
      catchApiError(this.texts().feedback.genericError, this.language()),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  protected readonly otpCodeLength = OTP_CODE_LENGTH;
}
