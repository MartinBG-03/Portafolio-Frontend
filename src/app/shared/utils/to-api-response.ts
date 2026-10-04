import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../core/models/api-response.interface';
import { Language } from '../../core/public/i18n/language';
import { API_ERROR_TEXTS } from './api-error-texts';

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  return typeof value === 'object' && value !== null && 'isSuccess' in value;
}

function describe(error: unknown, fallbackMessage: string, language: Language): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallbackMessage;
  }
  if (isApiResponse(error.error) && error.error.message) {
    return error.error.message;
  }

  const texts = API_ERROR_TEXTS[language];
  if (error.status === 403) {
    return texts.forbidden;
  }
  if (error.status === 404) {
    return texts.notFound;
  }
  return fallbackMessage;
}

export function toApiResponse(error: unknown, fallbackMessage: string, language: Language): ApiResponse<never> {
  console.error(error);
  return { isSuccess: false, message: describe(error, fallbackMessage, language) };
}
