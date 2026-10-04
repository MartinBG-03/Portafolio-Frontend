import { PagedQuery } from '../../../../../core/models/paged-result.interface';
import { AdColumnFilterValue } from '../../../../../shared/private/interfaces/ad-filter.interface';
import { DevLogMediaType, DevLogTitleDesign } from './devlog-entry.interface';

export interface DevLogEntryMediaRequest {
  readonly id?: number | null;
  readonly type: DevLogMediaType;
  readonly titleEs: string;
  readonly titleEn: string;
  readonly bodyEs?: string | null;
  readonly bodyEn?: string | null;
  readonly filePath: string;
  readonly fileName: string;
  readonly contentType?: string | null;
  readonly sizeBytes?: number | null;
  readonly sortOrder: number;
  readonly status: boolean;
}

export interface SaveDevLogEntryRequest {
  readonly titleEs: string;
  readonly titleEn: string;
  readonly descriptionEs: string;
  readonly descriptionEn: string;
  readonly bodyEs: string;
  readonly bodyEn: string;
  readonly titleDesign: DevLogTitleDesign;
  readonly displayDate: string;
  readonly isFeatured: boolean;
  readonly coverImagePath: string;
  readonly coverFileName: string;
  readonly listCoverImagePath: string;
  readonly listCoverFileName: string;
  readonly categoryIds: readonly number[];
  readonly media: readonly DevLogEntryMediaRequest[];
}

export type UpdateDevLogEntryRequest = SaveDevLogEntryRequest;

export interface SearchDevLogEntriesRequest extends PagedQuery {
  readonly search?: string | null;
  readonly filters?: readonly AdColumnFilterValue[];
}

export interface ChangeDevLogEntryStatusRequest {
  readonly status: boolean;
}
