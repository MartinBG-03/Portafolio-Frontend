import { MediaCardTone } from '../../../../shared/public/components/pb-media-card/pb-media-card';

export type FeedKind = 'project' | 'academy';
export type FeedFilter = 'all' | FeedKind;

export const FEED_FILTERS: readonly FeedFilter[] = ['all', 'project', 'academy'];

export interface FeedItem {
  readonly id: string;
  readonly kind: FeedKind;
  readonly date: string;
  readonly title: string;
  readonly tone: MediaCardTone;
  readonly path: string;
  readonly queryParams?: Readonly<Record<string, string>>;
}
