import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { AdLoadingService } from '../../shared/private/services/ad-loading.service';

const PUBLIC_URL = /^(https?:\/\/[^/]+\/)?(api\/)?public\//i;

export const loadingInterceptor: HttpInterceptorFn = (request, next) => {
  if (PUBLIC_URL.test(request.url)) {
    return next(request);
  }

  const loadingService = inject(AdLoadingService);
  loadingService.start();

  return next(request).pipe(finalize(() => loadingService.stop()));
};
