export type DevLogTitleDesign = 'left' | 'right';

export type DevLogMediaType = 'document' | 'image' | 'video' | 'audio';

export interface DevLogEntryMedia {
  readonly id: number | null;
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

export interface DevLogEntrySummary {
  readonly id: number;
  readonly titleEs: string;
  readonly titleEn: string;
  readonly descriptionEs: string;
  readonly descriptionEn: string;
  readonly slugEs: string;
  readonly slugEn: string;
  readonly titleDesign: DevLogTitleDesign;
  readonly coverImagePath?: string | null;
  readonly listCoverImagePath?: string | null;
  readonly displayDate: string;
  readonly isFeatured: boolean;
  readonly dateCreated: string;
  readonly status: boolean;
  readonly dateUpdated?: string | null;
}

export interface DevLogEntry extends DevLogEntrySummary {
  readonly bodyEs: string;
  readonly bodyEn: string;
  readonly coverFileName?: string | null;
  readonly listCoverFileName?: string | null;
  readonly categoryIds: readonly number[];
  readonly media: readonly DevLogEntryMedia[];
}

export interface DevLogCategoryOption {
  readonly id: number;
  readonly nameEs: string;
  readonly nameEn: string;
}
