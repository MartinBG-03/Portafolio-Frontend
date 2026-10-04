export type MediaFileType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE';

export interface MediaFile {
  readonly path: string;
  readonly url: string;
  readonly fileName: string;
  readonly contentType: string;
  readonly size: number;
  readonly type: MediaFileType;
}
