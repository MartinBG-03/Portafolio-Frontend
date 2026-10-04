import { Component, computed, effect, model, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { localized } from '../../../../../../shared/utils/localized';
import { AdDialog } from '../../../../../../shared/private/components/ad-dialog/ad-dialog';
import { AdFormRow } from '../../../../../../shared/private/components/ad-form-row/ad-form-row';
import { AdFormSection } from '../../../../../../shared/private/components/ad-form-section/ad-form-section';
import { AdSwitch } from '../../../../../../shared/private/components/ad-switch/ad-switch';
import { AdTextareaField } from '../../../../../../shared/private/components/ad-textarea-field/ad-textarea-field';
import { GAME_THEME_TEXTS } from '../../../constants/footer/game-theme.constants';
import { UpdateGameThemeRequest } from '../../../interfaces/footer/footer-request.interface';
import { GameTheme } from '../../../interfaces/footer/footer.interface';

export const GAME_THEME_LIMITS = {
  headlineMaxLength: 150,
  instructionsMaxLength: 200,
  gameOverMaxLength: 100,
  retryMaxLength: 150,
} as const;

export interface GameThemeFormTexts {
  readonly heading: (name: string) => string;
  readonly enabled: string;
  readonly headline: string;
  readonly headlineHint: string;
  readonly instructions: string;
  readonly instructionsHint: string;
  readonly gameOver: string;
  readonly gameOverHint: string;
  readonly retry: string;
  readonly retryHint: string;
  readonly required: string;
}

const TEXTS: Record<'es' | 'en', GameThemeFormTexts> = {
  es: {
    heading: (name) => `Editar modo: ${name}`,
    enabled: 'Modo disponible para los visitantes',
    headline: 'Mensaje grande',
    headlineHint: 'El texto destacado que invita a jugar, arriba del minijuego.',
    instructions: 'Instrucciones',
    instructionsHint: 'El texto de ayuda que se ve antes de empezar a jugar.',
    gameOver: 'Mensaje al perder',
    gameOverHint: 'El texto que aparece cuando el jugador choca.',
    retry: 'Texto para reintentar',
    retryHint: 'El texto que invita a volver a intentarlo.',
    required: 'Este campo es obligatorio.',
  },
  en: {
    heading: (name) => `Edit mode: ${name}`,
    enabled: 'Mode available to visitors',
    headline: 'Big headline',
    headlineHint: 'The featured text inviting people to play, above the minigame.',
    instructions: 'Instructions',
    instructionsHint: 'The hint text shown before the player starts.',
    gameOver: 'Game-over message',
    gameOverHint: 'The text shown when the player crashes.',
    retry: 'Retry text',
    retryHint: 'The text inviting the player to try again.',
    required: 'This field is required.',
  },
};

@Component({
  selector: 'ad-game-theme-form-dialog',
  imports: [ReactiveFormsModule, AdDialog, AdFormSection, AdFormRow, AdTextareaField, AdSwitch],
  templateUrl: './game-theme-form-dialog.html',
  styleUrl: './game-theme-form-dialog.scss',
})
export class GameThemeFormDialog {
  readonly open = model(false);
  readonly theme = model<GameTheme | null>(null);

  readonly saved = output<UpdateGameThemeRequest>();

  private readonly themeNames = localized(GAME_THEME_TEXTS);

  protected readonly texts = localized({ es: TEXTS.es, en: TEXTS.en });
  protected readonly limits = GAME_THEME_LIMITS;

  protected readonly heading = computed(() => {
    const theme = this.theme();
    return theme ? this.texts().heading(this.themeNames()[theme.theme]) : '';
  });

  protected readonly form = new FormGroup({
    isEnabled: new FormControl(true, { nonNullable: true }),
    headlineEs: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(GAME_THEME_LIMITS.headlineMaxLength)],
    }),
    headlineEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(GAME_THEME_LIMITS.headlineMaxLength)],
    }),
    instructionsEs: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(GAME_THEME_LIMITS.instructionsMaxLength)],
    }),
    instructionsEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(GAME_THEME_LIMITS.instructionsMaxLength)],
    }),
    gameOverEs: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(GAME_THEME_LIMITS.gameOverMaxLength)],
    }),
    gameOverEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(GAME_THEME_LIMITS.gameOverMaxLength)],
    }),
    retryEs: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(GAME_THEME_LIMITS.retryMaxLength)],
    }),
    retryEn: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(GAME_THEME_LIMITS.retryMaxLength)],
    }),
  });

  constructor() {
    effect(() => {
      if (this.open()) {
        const theme = this.theme();
        this.form.reset({
          isEnabled: theme?.isEnabled ?? true,
          headlineEs: theme?.headlineEs ?? '',
          headlineEn: theme?.headlineEn ?? '',
          instructionsEs: theme?.instructionsEs ?? '',
          instructionsEn: theme?.instructionsEn ?? '',
          gameOverEs: theme?.gameOverEs ?? '',
          gameOverEn: theme?.gameOverEn ?? '',
          retryEs: theme?.retryEs ?? '',
          retryEn: theme?.retryEn ?? '',
        });
      }
    });
  }

  protected errorOf(control: keyof typeof this.form.controls): string | null {
    const field = this.form.controls[control];
    if (field.valid || !field.touched) {
      return null;
    }
    return this.texts().required;
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.saved.emit(this.form.getRawValue());
  }
}
