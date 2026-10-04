import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../../core/models/api-response.interface';
import { SITE_FOOTER_ENDPOINTS } from '../../constants/footer/footer-endpoints';
import { UpdateGameSettingsRequest } from '../../interfaces/footer/footer-request.interface';
import { GameSettings } from '../../interfaces/footer/footer.interface';

@Injectable({ providedIn: 'root' })
export class GameSettingsService {
  private readonly http = inject(HttpClient);

  get(): Observable<ApiResponse<GameSettings>> {
    return this.http.get<ApiResponse<GameSettings>>(SITE_FOOTER_ENDPOINTS.gameSettings);
  }

  update(request: UpdateGameSettingsRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(SITE_FOOTER_ENDPOINTS.gameSettings, request);
  }
}
