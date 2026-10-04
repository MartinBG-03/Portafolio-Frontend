export type AdMediaKind = 'image' | 'video' | 'audio' | 'file';

export interface AdMediaItem {
  readonly key: string;
  readonly name: string;
  readonly url: string;
  readonly kind: AdMediaKind;
  readonly size?: number;
  readonly active?: boolean;
}

export interface AdMediaMove {
  readonly key: string;
  readonly offset: -1 | 1;
}

export interface AdMediaActiveChange {
  readonly key: string;
  readonly active: boolean;
}
