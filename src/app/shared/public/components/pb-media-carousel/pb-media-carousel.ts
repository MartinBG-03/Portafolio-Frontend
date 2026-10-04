import { Component, computed, inject, input, signal } from '@angular/core';
import { LanguageService } from '../../../../core/public/services/language.service';
import { Icon } from '../../../components/icon/icon';
import { PbMediaItem } from '../../interfaces/media-item.interface';
import { PbMediaLightbox } from '../pb-media-lightbox/pb-media-lightbox';
import { PbPaginator } from '../pb-paginator/pb-paginator';
import { PbVideoPlayer } from '../pb-video-player/pb-video-player';

type SlidePosition = 'current' | 'prev' | 'next' | 'before' | 'after';

@Component({
  selector: 'pb-media-carousel',
  imports: [Icon, PbPaginator, PbVideoPlayer, PbMediaLightbox],
  templateUrl: './pb-media-carousel.html',
  styleUrl: './pb-media-carousel.scss',
})
export class PbMediaCarousel {
  private readonly t = inject(LanguageService).t;

  readonly items = input.required<readonly PbMediaItem[]>();

  protected readonly index = signal(0);
  protected readonly lightboxOpen = signal(false);
  protected readonly lightboxIndex = signal(0);

  protected readonly texts = computed(() => this.t().media);
  protected readonly current = computed(() => this.items()[this.index()] ?? null);

  protected position(slide: number): SlidePosition {
    const offset = slide - this.index();
    if (offset === 0) {
      return 'current';
    }
    if (offset === -1) {
      return 'prev';
    }
    if (offset === 1) {
      return 'next';
    }
    return offset < 0 ? 'before' : 'after';
  }

  protected select(slide: number): void {
    if (slide !== this.index()) {
      this.index.set(slide);
    }
  }

  protected expand(): void {
    this.lightboxIndex.set(this.index());
    this.lightboxOpen.set(true);
  }

  protected onLightboxOpenChange(open: boolean): void {
    this.lightboxOpen.set(open);
    if (!open) {
      this.index.set(this.lightboxIndex());
    }
  }
}
