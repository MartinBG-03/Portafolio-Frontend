import { Localized } from '../../../../core/public/i18n/language';

export interface AuthTexts {
  readonly brandTitle: {
    readonly soft: string;
    readonly strong: string;
  };
  readonly validation: {
    readonly required: string;
    readonly invalidEmail: string;
    readonly invalidCode: string;
    readonly passwordTooShort: string;
  };
  readonly credentials: {
    readonly eyebrow: string;
    readonly title: string;
    readonly subtitle: string;
    readonly email: string;
    readonly emailPlaceholder: string;
    readonly password: string;
    readonly passwordPlaceholder: string;
    readonly showPassword: string;
    readonly hidePassword: string;
    readonly submit: string;
    readonly submitting: string;
  };
  readonly otp: {
    readonly eyebrow: string;
    readonly title: string;
    readonly subtitle: (email: string) => string;
    readonly code: string;
    readonly codePlaceholder: string;
    readonly submit: string;
    readonly submitting: string;
    readonly resend: string;
    readonly resending: string;
    readonly back: string;
  };
  readonly feedback: {
    readonly otpSentHeading: string;
    readonly otpSentMessage: (email: string) => string;
    readonly loginErrorHeading: string;
    readonly otpErrorHeading: string;
    readonly genericError: string;
  };
  readonly footer: string;
  readonly sessionExpired: {
    readonly heading: string;
    readonly message: string;
    readonly confirm: string;
  };
}

export const AUTH_TEXTS: Localized<AuthTexts> = {
  es: {
    brandTitle: { soft: 'Panel de', strong: 'administración' },
    validation: {
      required: 'Este campo es obligatorio.',
      invalidEmail: 'Ingresa un correo válido.',
      invalidCode: 'El código debe tener 6 dígitos.',
      passwordTooShort: 'La contraseña debe tener al menos 8 caracteres.',
    },
    credentials: {
      eyebrow: 'Acceso',
      title: 'Inicia sesión',
      subtitle: 'Ingresa tus credenciales para administrar el portafolio.',
      email: 'Correo electrónico',
      emailPlaceholder: 'tu@correo.com',
      password: 'Contraseña',
      passwordPlaceholder: '••••••••',
      showPassword: 'Mostrar contraseña',
      hidePassword: 'Ocultar contraseña',
      submit: 'Ingresar',
      submitting: 'Enviando código…',
    },
    otp: {
      eyebrow: 'Verificación',
      title: 'Revisa tu correo',
      subtitle: (email) => `Enviamos un código de 6 dígitos a ${email}.`,
      code: 'Código de verificación',
      codePlaceholder: '000000',
      submit: 'Verificar',
      submitting: 'Verificando…',
      resend: 'Reenviar código',
      resending: 'Reenviando…',
      back: 'Volver',
    },
    feedback: {
      otpSentHeading: 'Código enviado',
      otpSentMessage: (email) => `Revisa la bandeja de entrada de ${email}.`,
      loginErrorHeading: 'No se pudo iniciar sesión',
      otpErrorHeading: 'No se pudo verificar el código',
      genericError: 'Ocurrió un error inesperado. Inténtalo de nuevo.',
    },
    footer: '© 2026 · Martín Bastidas',
    sessionExpired: {
      heading: 'La sesión caducó',
      message: 'Tu sesión expiró. Inicia sesión de nuevo para continuar.',
      confirm: 'Entendido',
    },
  },
  en: {
    brandTitle: { soft: 'Admin', strong: 'panel' },
    validation: {
      required: 'This field is required.',
      invalidEmail: 'Enter a valid email.',
      invalidCode: 'The code must have 6 digits.',
      passwordTooShort: 'Password must be at least 8 characters.',
    },
    credentials: {
      eyebrow: 'Access',
      title: 'Sign in',
      subtitle: 'Enter your credentials to manage the portfolio.',
      email: 'Email',
      emailPlaceholder: 'you@email.com',
      password: 'Password',
      passwordPlaceholder: '••••••••',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      submit: 'Sign in',
      submitting: 'Sending code…',
    },
    otp: {
      eyebrow: 'Verification',
      title: 'Check your email',
      subtitle: (email) => `We sent a 6-digit code to ${email}.`,
      code: 'Verification code',
      codePlaceholder: '000000',
      submit: 'Verify',
      submitting: 'Verifying…',
      resend: 'Resend code',
      resending: 'Resending…',
      back: 'Back',
    },
    feedback: {
      otpSentHeading: 'Code sent',
      otpSentMessage: (email) => `Check the inbox for ${email}.`,
      loginErrorHeading: "Couldn't sign in",
      otpErrorHeading: "Couldn't verify the code",
      genericError: 'An unexpected error occurred. Please try again.',
    },
    footer: '© 2026 · Martín Bastidas',
    sessionExpired: {
      heading: 'Your session expired',
      message: 'Your session expired. Sign in again to continue.',
      confirm: 'Got it',
    },
  },
};
