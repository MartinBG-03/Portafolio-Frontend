import {
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { LanguageService } from '../../../../../core/public/services/language.service';
import { formatLongDate } from '../../../../../shared/utils/format-date-time';
import { RoundedPolygonCorner, roundedPolygonPath } from '../../../../../shared/utils/rounded-polygon-path';
import { Icon } from '../../../../../shared/components/icon/icon';

export type PbDevLogTitleCardButtonsPosition = 'left' | 'right';
export type PbDevLogTitleCardShareResult = 'native' | 'copied' | 'failed';

export interface PbDevLogTitleCardCategory {
  readonly id: number;
  readonly label: string;
}

interface BoxSize {
  readonly width: number;
  readonly height: number;
}

const EMPTY_SIZE: BoxSize = { width: 0, height: 0 };
const CARD_RADIUS = 24;
const NOTCH_RADIUS = 14;
const NOTCH_GAP = 8;
const CATEGORIES_PER_PAGE = 3;

let devLogTitleCardSequence = 0;

function sizeOf(element: HTMLElement): BoxSize {
  return { width: element.offsetWidth, height: element.offsetHeight };
}

@Component({
  selector: 'pb-devlog-title-card',
  imports: [Icon],
  templateUrl: './pb-devlog-title-card.html',
  styleUrl: './pb-devlog-title-card.scss',
})
export class PbDevlogTitleCard {
  private readonly languageService = inject(LanguageService);

  readonly title = input.required<string>();
  readonly categories = input<readonly PbDevLogTitleCardCategory[]>([]);
  readonly date = input<string | Date | null>(null);
  readonly coverImageUrl = input<string | null>(null);
  readonly buttonsPosition = input<PbDevLogTitleCardButtonsPosition>('left');
  readonly shareUrl = input<string | null>(null);

  readonly sharedResult = output<PbDevLogTitleCardShareResult>();

  protected readonly texts = computed(() => this.languageService.t().devLog.card);

  private readonly categoryPage = signal(0);

  protected readonly categoryPages = computed(() =>
    Math.max(1, Math.ceil(this.categories().length / CATEGORIES_PER_PAGE)),
  );

  protected readonly visibleCategories = computed<readonly PbDevLogTitleCardCategory[]>(() => {
    const start = this.categoryPage() * CATEGORIES_PER_PAGE;
    return this.categories().slice(start, start + CATEGORIES_PER_PAGE);
  });

  protected readonly isFirstCategoryPage = computed(() => this.categoryPage() <= 0);
  protected readonly isLastCategoryPage = computed(() => this.categoryPage() >= this.categoryPages() - 1);

  private readonly cardRef = viewChild.required<ElementRef<HTMLElement>>('card');
  private readonly actionsRef = viewChild.required<ElementRef<HTMLElement>>('actions');

  protected readonly patternId = `devlog-card-cover-${++devLogTitleCardSequence}`;

  protected readonly size = signal<BoxSize>(EMPTY_SIZE);
  private readonly actionsSize = signal<BoxSize>(EMPTY_SIZE);

  protected readonly bottomNotch = computed<BoxSize>(() => {
    const actions = this.actionsSize();
    return { width: actions.width + NOTCH_GAP, height: actions.height + NOTCH_GAP };
  });

  private readonly language = this.languageService.language;

  protected readonly formattedDate = computed(() => {
    const date = this.date();
    return date ? formatLongDate(date, this.language()) : null;
  });

  protected readonly isoDate = computed(() => {
    const date = this.date();
    return date ? new Date(date).toISOString() : null;
  });

  protected readonly viewBox = computed(() => `0 0 ${this.size().width} ${this.size().height}`);

  protected readonly shapePath = computed(() => {
    const { width, height } = this.size();
    if (width === 0 || height === 0) {
      return null;
    }
    return roundedPolygonPath(this.shapeCorners(width, height));
  });

  constructor() {
    const observer = new ResizeObserver(() => this.measure());
    inject(DestroyRef).onDestroy(() => observer.disconnect());

    effect(() => {
      observer.disconnect();
      observer.observe(this.cardRef().nativeElement);
      observer.observe(this.actionsRef().nativeElement);
      this.measure();
    });

    effect(() => {
      this.categories();
      this.categoryPage.set(0);
    });
  }

  protected previousCategoryPage(): void {
    if (!this.isFirstCategoryPage()) {
      this.categoryPage.update((page) => page - 1);
    }
  }

  protected nextCategoryPage(): void {
    if (!this.isLastCategoryPage()) {
      this.categoryPage.update((page) => page + 1);
    }
  }

  private measure(): void {
    this.size.set(sizeOf(this.cardRef().nativeElement));
    this.actionsSize.set(sizeOf(this.actionsRef().nativeElement));
  }

  private shapeCorners(width: number, height: number): RoundedPolygonCorner[] {
    const bottom = this.bottomNotch();
    const inner = Math.min(NOTCH_RADIUS, bottom.height / 2);

    const bottomEdge: RoundedPolygonCorner[] =
      this.buttonsPosition() === 'right'
        ? [
            { x: width, y: height - bottom.height, radius: inner },
            { x: width - bottom.width, y: height - bottom.height, radius: inner },
            { x: width - bottom.width, y: height, radius: inner },
            { x: 0, y: height, radius: CARD_RADIUS },
          ]
        : [
            { x: width, y: height, radius: CARD_RADIUS },
            { x: bottom.width, y: height, radius: inner },
            { x: bottom.width, y: height - bottom.height, radius: inner },
            { x: 0, y: height - bottom.height, radius: inner },
          ];

    return [
      { x: 0, y: 0, radius: CARD_RADIUS },
      { x: width, y: 0, radius: CARD_RADIUS },
      ...bottomEdge,
    ];
  }

  protected async onShare(): Promise<void> {
    const url = this.shareUrl();
    if (!url) {
      return;
    }

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: this.title(), url });
        this.sharedResult.emit('native');
        return;
      } catch {
        // fall through to the clipboard fallback below
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      this.sharedResult.emit('copied');
    } catch {
      this.sharedResult.emit('failed');
    }
  }
}
