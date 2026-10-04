import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../../../../core/models/api-response.interface';
import { PagedResult } from '../../../../core/models/paged-result.interface';
import { buildHttpParams } from '../../../../shared/utils/build-http-params';
import { devLogFileUrl } from '../utils/devlog-file-url';
import {
  DevLogCategory,
  DevLogEntry,
  DevLogResource,
} from '../models/devlog-entry.model';
import { DevLogEntryDto, DevLogEntryMediaDto, DevLogPublicEntrySummaryDto } from '../interfaces/devlog-entry-dto.interface';

export interface DevLogEntrySummaryView {
  readonly id: number;
  readonly slug: { readonly es: string; readonly en: string };
  readonly title: { readonly es: string; readonly en: string };
  readonly description: { readonly es: string; readonly en: string };
  readonly date: string;
  readonly coverUrl: string | null;
  readonly categories: readonly DevLogCategory[];
}

export interface ListPublicEntriesQuery {
  readonly catalogId?: number | null;
  readonly search?: string | null;
  readonly pageNumber?: number;
  readonly pageSize?: number;
}

function mapSummary(entry: DevLogPublicEntrySummaryDto): DevLogEntrySummaryView {
  return {
    id: entry.id,
    slug: { es: entry.slugEs, en: entry.slugEn },
    title: { es: entry.titleEs, en: entry.titleEn },
    description: { es: entry.descriptionEs, en: entry.descriptionEn },
    date: entry.displayDate,
    coverUrl: devLogFileUrl(entry.listCoverImagePath),
    categories: entry.categories.map((category) => ({
      id: category.id,
      name: { es: category.nameEs, en: category.nameEn },
    })),
  };
}

function mapMedia(media: DevLogEntryMediaDto): DevLogResource {
  return {
    id: media.id,
    type: media.type,
    title: { es: media.titleEs, en: media.titleEn },
    body: media.bodyEs || media.bodyEn ? { es: media.bodyEs ?? '', en: media.bodyEn ?? '' } : null,
    fileName: media.fileName,
    url: devLogFileUrl(media.filePath) ?? '',
    sizeBytes: media.sizeBytes ?? undefined,
    status: media.status,
  };
}

@Injectable({ providedIn: 'root' })
export class DevLogEntryPublicService {
  private readonly http = inject(HttpClient);

  list(query: ListPublicEntriesQuery = {}): Observable<PagedResult<DevLogEntrySummaryView>> {
    return this.http
      .get<ApiResponse<PagedResult<DevLogPublicEntrySummaryDto>>>('public/devlog-entries', {
        params: buildHttpParams({
          catalogId: query.catalogId,
          search: query.search,
          pageNumber: query.pageNumber,
          pageSize: query.pageSize,
        }),
      })
      .pipe(
        map((response) => {
          const page = response.data;
          const items = (page?.items ?? []).map(mapSummary);

          return {
            items,
            pageNumber: page?.pageNumber ?? 1,
            pageSize: page?.pageSize ?? items.length,
            totalRecords: page?.totalRecords ?? items.length,
            totalPages: page?.totalPages ?? 1,
            hasPreviousPage: page?.hasPreviousPage ?? false,
            hasNextPage: page?.hasNextPage ?? false,
          };
        }),
      );
  }

  getFeatured(): Observable<DevLogEntrySummaryView | null> {
    return this.http
      .get<ApiResponse<DevLogPublicEntrySummaryDto | null>>('public/devlog-entries/featured')
      .pipe(map((response) => (response.isSuccess && response.data ? mapSummary(response.data) : null)));
  }

  getBySlug(slug: string, categories: readonly DevLogCategory[]): Observable<DevLogEntry | null> {
    return this.http.get<ApiResponse<DevLogEntryDto>>(`public/devlog-entries/${slug}`).pipe(
      map((response) => {
        const entry = response.data;
        if (!response.isSuccess || !entry) {
          return null;
        }

        const categoryById = new Map(categories.map((category) => [category.id, category]));

        return {
          id: entry.id,
          slug: { es: entry.slugEs, en: entry.slugEn },
          title: { es: entry.titleEs, en: entry.titleEn },
          description: { es: entry.descriptionEs, en: entry.descriptionEn },
          body: { es: entry.bodyEs, en: entry.bodyEn },
          date: entry.displayDate,
          coverUrl: devLogFileUrl(entry.coverImagePath),
          titleDesign: entry.titleDesign,
          categories: entry.categoryIds
            .map((id) => categoryById.get(id))
            .filter((category): category is DevLogCategory => !!category),
          resources: entry.media.map(mapMedia),
        };
      }),
    );
  }
}
