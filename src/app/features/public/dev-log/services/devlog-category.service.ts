import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { ApiResponse } from '../../../../core/models/api-response.interface';
import { buildHttpParams } from '../../../../shared/utils/build-http-params';
import { DevLogCategory } from '../models/devlog-entry.model';
import { CatalogTreeNodeDto } from '../interfaces/devlog-entry-dto.interface';

const DEVLOG_CATEGORIES_ROOT_CODE = 'DEVLOGCATS';

@Injectable({ providedIn: 'root' })
export class DevLogCategoryService {
  private readonly http = inject(HttpClient);

  private readonly categories$ = this.http
    .get<ApiResponse<readonly CatalogTreeNodeDto[]>>('public/catalogs/tree', {
      params: buildHttpParams({ rootCode: DEVLOG_CATEGORIES_ROOT_CODE, onlyActive: true }),
    })
    .pipe(
      map((response): readonly DevLogCategory[] =>
        (response.data ?? [])
          .filter((node) => node.level > 0)
          .map((node) => ({ id: node.id, name: { es: node.nameEs, en: node.nameEn } })),
      ),
      shareReplay(1),
    );

  list(): Observable<readonly DevLogCategory[]> {
    return this.categories$;
  }
}
