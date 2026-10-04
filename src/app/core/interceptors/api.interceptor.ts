import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../config/environment.generated';
import { LanguageService } from '../public/services/language.service';

const ACCEPT_LANGUAGE_HEADER = 'Accept-Language';
const ABSOLUTE_URL = /^https?:\/\//i;

export const apiInterceptor: HttpInterceptorFn = (request, next) => {
  const language = inject(LanguageService).language();

  return next(
    ABSOLUTE_URL.test(request.url)
      ? request
      : request.clone({
          url: `${environment.apiBaseUrl}/${request.url}`,
          setHeaders: { [ACCEPT_LANGUAGE_HEADER]: language },
        }),
  );
};
