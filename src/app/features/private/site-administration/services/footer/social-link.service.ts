import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { ApiResponse } from '../../../../../core/models/api-response.interface';
import { CatalogService } from '../../../system-configuration/services/catalogs/catalog.service';
import { SITE_FOOTER_ENDPOINTS } from '../../constants/footer/footer-endpoints';
import {
  ChangeFooterStatusRequest,
  SaveSocialLinkRequest,
} from '../../interfaces/footer/footer-request.interface';
import { SocialLink, SocialPlatformOption } from '../../interfaces/footer/footer.interface';

const SOCIAL_PLATFORMS_ROOT_CODE = 'SOCIALNET';

@Injectable({ providedIn: 'root' })
export class SocialLinkService {
  private readonly http = inject(HttpClient);
  private readonly catalogService = inject(CatalogService);

  list(): Observable<ApiResponse<readonly SocialLink[]>> {
    return this.http.get<ApiResponse<readonly SocialLink[]>>(SITE_FOOTER_ENDPOINTS.socials);
  }

  create(request: SaveSocialLinkRequest): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(SITE_FOOTER_ENDPOINTS.socials, request);
  }

  update(id: number, request: SaveSocialLinkRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(SITE_FOOTER_ENDPOINTS.socialById(id), request);
  }

  changeStatus(id: number, status: boolean): Observable<ApiResponse> {
    const request: ChangeFooterStatusRequest = { status };
    return this.http.patch<ApiResponse>(SITE_FOOTER_ENDPOINTS.socialStatus(id), request);
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(SITE_FOOTER_ENDPOINTS.socialById(id));
  }

  getPlatformOptions(): Observable<ApiResponse<readonly SocialPlatformOption[]>> {
    return this.catalogService.list({ pageSize: 100 }).pipe(
      switchMap((response) => {
        if (!response.isSuccess || !response.data) {
          return of({ isSuccess: false, message: response.message } as ApiResponse<
            readonly SocialPlatformOption[]
          >);
        }

        const root = response.data.items.find((catalog) => catalog.code === SOCIAL_PLATFORMS_ROOT_CODE);
        if (!root) {
          return of({ isSuccess: true, data: [] } as ApiResponse<readonly SocialPlatformOption[]>);
        }

        return this.catalogService.getTree({ rootId: root.id, onlyActive: true }).pipe(
          map((treeResponse) => {
            if (!treeResponse.isSuccess || !treeResponse.data) {
              return { isSuccess: false, message: treeResponse.message } as ApiResponse<
                readonly SocialPlatformOption[]
              >;
            }

            const options = treeResponse.data
              .filter((node) => node.level > 0)
              .map((node) => ({ id: node.id, code: node.code, nameEs: node.nameEs, nameEn: node.nameEn }));

            return { isSuccess: true, data: options } as ApiResponse<readonly SocialPlatformOption[]>;
          }),
        );
      }),
    );
  }
}
