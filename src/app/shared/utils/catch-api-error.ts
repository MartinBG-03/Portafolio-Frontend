import { catchError, Observable, of, OperatorFunction } from 'rxjs';
import { ApiResponse } from '../../core/models/api-response.interface';
import { Language } from '../../core/public/i18n/language';
import { toApiResponse } from './to-api-response';

export function catchApiError<T>(
  fallbackMessage: string,
  language: Language,
): OperatorFunction<ApiResponse<T>, ApiResponse<T>> {
  return (source: Observable<ApiResponse<T>>) =>
    source.pipe(catchError((error: unknown) => of(toApiResponse(error, fallbackMessage, language))));
}
