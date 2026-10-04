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
import { AdTooltipDirective } from '../../../../../../shared/private/directives/ad-tooltip.directive';
import { Localized } from '../../../../../../core/public/i18n/language';
import { LanguageService } from '../../../../../../core/public/services/language.service';
import { formatLongDate } from '../../../../../../shared/utils/format-date-time';
import { localized } from '../../../../../../shared/utils/localized';
import { RoundedPolygonCorner, roundedPolygonPath } from '../../../../../../shared/utils/rounded-polygon-path';
import { AdIcon } from '../../../../../../shared/private/components/ad-icon/ad-icon';

export type DevLogTitleCardButtonsPosition = 'left' | 'right';
export type DevLogTitleCardShareResult = 'native' | 'copied' | 'failed';

export interface DevLogTitleCardCategory {
  readonly id: number;
  readonly label: string;
}

const DEVLOG_TITLE_CARD_TEXTS: Localized<{
  readonly previousCategory: string;
  readonly nextCategory: string;
  readonly download: string;
  readonly share: string;
  readonly shareUnavailable: string;
  readonly comingSoon: string;
}> = {
  es: {
    previousCategory: 'Categoría anterior',
    nextCategory: 'Siguiente categoría',
    download: 'Descargar',
    share: 'Compartir',
    shareUnavailable: 'Compartir (disponible al publicar)',
    comingSoon: 'Próximamente',
  },
  en: {
    previousCategory: 'Previous category',
    nextCategory: 'Next category',
    download: 'Download',
    share: 'Share',
    shareUnavailable: 'Share (available once published)',
    comingSoon: 'Coming soon',
  },
};

interface BoxSize {
  readonly width: number;
  readonly height: number;
}

const EMPTY_SIZE: BoxSize = { width: 0, height: 0 };
const CARD_RADIUS = 24;
const NOTCH_RADIUS = 14;
const NOTCH_GAP = 8;

let devLogTitleCardSequence = 0;

function sizeOf(element: HTMLElement): BoxSize {
  return { width: element.offsetWidth, height: element.offsetHeight };
}

@Component({
  selector: 'ad-devlog-title-card',
  imports: [AdIcon, AdTooltipDirective],
  templateUrl: './devlog-title-card.html',
  styleUrl: './devlog-title-card.scss',
})
export class DevlogTitleCard {
  readonly title = input.required<string>();
  readonly categories = input<readonly DevLogTitleCardCategory[]>([]);
  readonly date = input<string | Date | null>(null);
  readonly coverImageUrl = input<string | null>(null);
  readonly buttonsPosition = input<DevLogTitleCardButtonsPosition>('left');
  readonly shareUrl = input<string | null>(null);

  readonly sharedResult = output<DevLogTitleCardShareResult>();

  protected readonly texts = localized(DEVLOG_TITLE_CARD_TEXTS);

  private readonly categoryIndex = signal(0);

  protected readonly currentCategory = computed<DevLogTitleCardCategory | null>(() => {
    const categories = this.categories();
    if (categories.length === 0) {
      return null;
    }
    return categories[this.categoryIndex() % categories.length];
  });

  private readonly cardRef = viewChild.required<ElementRef<HTMLElement>>('card');
  private readonly actionsRef = viewChild.required<ElementRef<HTMLElement>>('actions');

  protected readonly patternId = `devlog-card-cover-${++devLogTitleCardSequence}`;

  protected readonly size = signal<BoxSize>(EMPTY_SIZE);
  private readonly actionsSize = signal<BoxSize>(EMPTY_SIZE);

  protected readonly bottomNotch = computed<BoxSize>(() => {
    const actions = this.actionsSize();
    return { width: actions.width + NOTCH_GAP, height: actions.height + NOTCH_GAP };
  });

  private readonly language = inject(LanguageService).language;

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
  }

  protected previousCategory(): void {
    const total = this.categories().length;
    if (total < 2) {
      return;
    }
    this.categoryIndex.update((index) => (index - 1 + total) % total);
  }

  protected nextCategory(): void {
    const total = this.categories().length;
    if (total < 2) {
      return;
    }
    this.categoryIndex.update((index) => (index + 1) % total);
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
