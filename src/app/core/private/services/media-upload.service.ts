import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/api-response.interface';
import { MediaFile } from '../../models/media-file.interface';
import { MEDIA_ENDPOINTS, MEDIA_UPLOAD_FIELD } from '../config/media.config';

@Injectable({ providedIn: 'root' })
export class MediaUploadService {
  private readonly http = inject(HttpClient);

  upload(file: File): Observable<ApiResponse<MediaFile>> {
    const body = new FormData();
    body.append(MEDIA_UPLOAD_FIELD, file, file.name);
    return this.http.post<ApiResponse<MediaFile>>(MEDIA_ENDPOINTS.upload, body);
  }
}
