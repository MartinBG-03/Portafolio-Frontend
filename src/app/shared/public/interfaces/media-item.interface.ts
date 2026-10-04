export type PbMediaKind = 'image' | 'video';

export interface PbMediaItem {
  readonly id: string | number;
  readonly kind: PbMediaKind;
  readonly src: string;
  readonly poster?: string | null;
  readonly title: string;
  readonly body?: string | null;
}
