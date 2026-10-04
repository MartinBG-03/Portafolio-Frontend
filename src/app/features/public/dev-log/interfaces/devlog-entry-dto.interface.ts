import { DevLogResourceType, DevLogTitleDesign } from '../models/devlog-entry.model';

export interface DevLogCategoryRefDto {
  readonly id: number;
  readonly nameEs: string;
  readonly nameEn: string;
}

export interface DevLogPublicEntrySummaryDto {
  readonly id: number;
  readonly titleEs: string;
  readonly titleEn: string;
  readonly descriptionEs: string;
  readonly descriptionEn: string;
  readonly slugEs: string;
  readonly slugEn: string;
  readonly titleDesign: DevLogTitleDesign;
  readonly coverImagePath: string | null;
  readonly listCoverImagePath: string | null;
  readonly displayDate: string;
  readonly isFeatured: boolean;
  readonly dateCreated: string;
  readonly categories: readonly DevLogCategoryRefDto[];
}

export interface DevLogEntryMediaDto {
  readonly id: number;
  readonly type: DevLogResourceType;
  readonly titleEs: string;
  readonly titleEn: string;
  readonly bodyEs: string | null;
  readonly bodyEn: string | null;
  readonly filePath: string;
  readonly fileName: string;
  readonly contentType: string | null;
  readonly sizeBytes: number | null;
  readonly sortOrder: number;
  readonly status: boolean;
}

export interface DevLogEntryDto {
  readonly id: number;
  readonly titleEs: string;
  readonly titleEn: string;
  readonly descriptionEs: string;
  readonly descriptionEn: string;
  readonly slugEs: string;
  readonly slugEn: string;
  readonly titleDesign: DevLogTitleDesign;
  readonly coverImagePath: string | null;
  readonly listCoverImagePath: string | null;
  readonly displayDate: string;
  readonly isFeatured: boolean;
  readonly dateCreated: string;
  readonly bodyEs: string;
  readonly bodyEn: string;
  readonly coverFileName: string | null;
  readonly listCoverFileName: string | null;
  readonly status: boolean;
  readonly dateUpdated: string | null;
  readonly categoryIds: readonly number[];
  readonly media: readonly DevLogEntryMediaDto[];
}

export interface CatalogTreeNodeDto {
  readonly id: number;
  readonly parentId: number | null;
  readonly code: string;
  readonly nameEn: string;
  readonly nameEs: string;
  readonly level: number;
}
