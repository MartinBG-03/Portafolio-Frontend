import { Localized } from '../../../../core/public/i18n/language';

export type DevLogResourceType = 'document' | 'image' | 'video' | 'audio';
export type DevLogTitleDesign = 'left' | 'right';

export interface DevLogCategory {
  readonly id: number;
  readonly name: Localized;
}

export interface DevLogResource {
  readonly id: number;
  readonly type: DevLogResourceType;
  readonly title: Localized;
  readonly body: Localized | null;
  readonly fileName: string;
  readonly url: string;
  readonly poster?: string;
  readonly sizeBytes?: number;
  readonly status: boolean;
}

export interface DevLogEntry {
  readonly id: number;
  readonly slug: Localized;
  readonly title: Localized;
  readonly description: Localized;
  readonly body: Localized;
  readonly date: string;
  readonly coverUrl: string | null;
  readonly titleDesign: DevLogTitleDesign;
  readonly categories: readonly DevLogCategory[];
  readonly resources: readonly DevLogResource[];
}

export interface DevLogDocumentView {
  readonly id: number;
  readonly title: string;
  readonly body: string | null;
  readonly fileName: string;
  readonly url: string;
  readonly sizeBytes: number | null;
}

export interface DevLogAudioView {
  readonly id: number;
  readonly title: string;
  readonly body: string | null;
  readonly url: string;
}
