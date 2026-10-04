import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../../core/models/api-response.interface';
import { PagedResult } from '../../../../../core/models/paged-result.interface';
import { buildHttpParams } from '../../../../../shared/utils/build-http-params';
import { CATALOG_ENDPOINTS } from '../../constants/catalogs/catalog-endpoints';
import {
  ChangeCatalogStatusRequest,
  CatalogTreeQuery,
  CreateCatalogRequest,
  SearchCatalogsRequest,
  UpdateCatalogRequest,
} from '../../interfaces/catalogs/catalog-request.interface';
import { Catalog, CatalogTreeNode } from '../../interfaces/catalogs/catalog.interface';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);

  list(request: SearchCatalogsRequest = {}): Observable<ApiResponse<PagedResult<Catalog>>> {
    return this.http.post<ApiResponse<PagedResult<Catalog>>>(
      CATALOG_ENDPOINTS.search,
      request,
    );
  }

  getTree(query: CatalogTreeQuery = {}): Observable<ApiResponse<readonly CatalogTreeNode[]>> {
    return this.http.get<ApiResponse<readonly CatalogTreeNode[]>>(
      CATALOG_ENDPOINTS.tree,
      { params: buildHttpParams({ ...query }) },
    );
  }

  getById(id: number): Observable<ApiResponse<Catalog>> {
    return this.http.get<ApiResponse<Catalog>>(CATALOG_ENDPOINTS.byId(id));
  }

  create(request: CreateCatalogRequest): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(CATALOG_ENDPOINTS.base, request);
  }

  update(id: number, request: UpdateCatalogRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(CATALOG_ENDPOINTS.byId(id), request);
  }

  changeStatus(id: number, status: boolean): Observable<ApiResponse> {
    const request: ChangeCatalogStatusRequest = { status };
    return this.http.patch<ApiResponse>(CATALOG_ENDPOINTS.status(id), request);
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(CATALOG_ENDPOINTS.byId(id));
  }
}
