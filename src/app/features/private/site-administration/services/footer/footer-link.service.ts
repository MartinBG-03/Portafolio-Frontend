import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../../core/models/api-response.interface';
import { SITE_FOOTER_ENDPOINTS } from '../../constants/footer/footer-endpoints';
import {
  ChangeFooterStatusRequest,
  SaveFooterLinkRequest,
} from '../../interfaces/footer/footer-request.interface';
import { FooterLink } from '../../interfaces/footer/footer.interface';

@Injectable({ providedIn: 'root' })
export class FooterLinkService {
  private readonly http = inject(HttpClient);

  list(): Observable<ApiResponse<readonly FooterLink[]>> {
    return this.http.get<ApiResponse<readonly FooterLink[]>>(SITE_FOOTER_ENDPOINTS.links);
  }

  create(request: SaveFooterLinkRequest): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(SITE_FOOTER_ENDPOINTS.links, request);
  }

  update(id: number, request: SaveFooterLinkRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(SITE_FOOTER_ENDPOINTS.linkById(id), request);
  }

  changeStatus(id: number, status: boolean): Observable<ApiResponse> {
    const request: ChangeFooterStatusRequest = { status };
    return this.http.patch<ApiResponse>(SITE_FOOTER_ENDPOINTS.linkStatus(id), request);
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(SITE_FOOTER_ENDPOINTS.linkById(id));
  }
}
