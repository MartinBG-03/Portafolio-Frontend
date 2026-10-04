import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { ApiResponse } from '../../../../../core/models/api-response.interface';
import { PagedResult } from '../../../../../core/models/paged-result.interface';
import { CatalogService } from '../../../system-configuration/services/catalogs/catalog.service';
import { DEVLOG_ENTRY_ENDPOINTS } from '../../constants/entries/devlog-entry-endpoints';
import {
  ChangeDevLogEntryStatusRequest,
  SaveDevLogEntryRequest,
  SearchDevLogEntriesRequest,
  UpdateDevLogEntryRequest,
} from '../../interfaces/entries/devlog-entry-request.interface';
import {
  DevLogCategoryOption,
  DevLogEntry,
  DevLogEntrySummary,
} from '../../interfaces/entries/devlog-entry.interface';

const DEVLOG_CATEGORIES_ROOT_CODE = 'DEVLOGCATS';

@Injectable({ providedIn: 'root' })
export class DevLogEntryService {
  private readonly http = inject(HttpClient);
  private readonly catalogService = inject(CatalogService);

  list(
    request: SearchDevLogEntriesRequest = {},
  ): Observable<ApiResponse<PagedResult<DevLogEntrySummary>>> {
    return this.http.post<ApiResponse<PagedResult<DevLogEntrySummary>>>(
      DEVLOG_ENTRY_ENDPOINTS.search,
      request,
    );
  }

  getById(id: number): Observable<ApiResponse<DevLogEntry>> {
    return this.http.get<ApiResponse<DevLogEntry>>(DEVLOG_ENTRY_ENDPOINTS.byId(id));
  }

  create(request: SaveDevLogEntryRequest): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(DEVLOG_ENTRY_ENDPOINTS.base, request);
  }

  update(id: number, request: UpdateDevLogEntryRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(DEVLOG_ENTRY_ENDPOINTS.byId(id), request);
  }

  changeStatus(id: number, status: boolean): Observable<ApiResponse> {
    const request: ChangeDevLogEntryStatusRequest = { status };
    return this.http.patch<ApiResponse>(DEVLOG_ENTRY_ENDPOINTS.status(id), request);
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(DEVLOG_ENTRY_ENDPOINTS.byId(id));
  }

  setFeatured(id: number): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(DEVLOG_ENTRY_ENDPOINTS.featured(id), {});
  }

  getCategoryOptions(): Observable<ApiResponse<readonly DevLogCategoryOption[]>> {
    return this.catalogService.list({ pageSize: 100 }).pipe(
      switchMap((response) => {
        if (!response.isSuccess || !response.data) {
          return of({ isSuccess: false, message: response.message } as ApiResponse<
            readonly DevLogCategoryOption[]
          >);
        }

        const root = response.data.items.find((catalog) => catalog.code === DEVLOG_CATEGORIES_ROOT_CODE);
        if (!root) {
          return of({ isSuccess: true, data: [] } as ApiResponse<readonly DevLogCategoryOption[]>);
        }

        return this.catalogService.getTree({ rootId: root.id, onlyActive: true }).pipe(
          map((treeResponse) => {
            if (!treeResponse.isSuccess || !treeResponse.data) {
              return { isSuccess: false, message: treeResponse.message } as ApiResponse<
                readonly DevLogCategoryOption[]
              >;
            }

            const options = treeResponse.data
              .filter((node) => node.level > 0)
              .map((node) => ({ id: node.id, nameEs: node.nameEs, nameEn: node.nameEn }));

            return { isSuccess: true, data: options } as ApiResponse<readonly DevLogCategoryOption[]>;
          }),
        );
      }),
    );
  }
}
