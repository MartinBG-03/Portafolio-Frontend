import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../../core/models/api-response.interface';
import { SITE_FOOTER_ENDPOINTS } from '../../constants/footer/footer-endpoints';
import { UpdateGameThemeRequest } from '../../interfaces/footer/footer-request.interface';
import { GameTheme } from '../../interfaces/footer/footer.interface';

@Injectable({ providedIn: 'root' })
export class FooterGameThemeService {
  private readonly http = inject(HttpClient);

  list(): Observable<ApiResponse<readonly GameTheme[]>> {
    return this.http.get<ApiResponse<readonly GameTheme[]>>(SITE_FOOTER_ENDPOINTS.gameThemes);
  }

  update(id: number, request: UpdateGameThemeRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(SITE_FOOTER_ENDPOINTS.gameThemeById(id), request);
  }
}
