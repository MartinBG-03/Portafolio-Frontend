import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, throwError } from 'rxjs';
import { AuthService } from '../private/services/auth.service';
import { SessionExpiredService } from '../private/services/session-expired.service';

const ABSOLUTE_URL = /^https?:\/\//i;

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const sessionExpired = inject(SessionExpiredService);
  const router = inject(Router);

  const token = authService.token();
  const authorized =
    token && !ABSOLUTE_URL.test(request.url)
      ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : request;

  return next(authorized).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        authService.logout();
        sessionExpired.show();
        router.navigateByUrl('/login');
        return EMPTY;
      }
      return throwError(() => error);
    }),
  );
};
