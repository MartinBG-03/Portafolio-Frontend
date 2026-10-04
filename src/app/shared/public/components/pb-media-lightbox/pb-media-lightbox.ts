import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  model,
  viewChild,
} from '@angular/core';
import { LanguageService } from '../../../../core/public/services/language.service';
import { Icon } from '../../../components/icon/icon';
import { PbMediaItem } from '../../interfaces/media-item.interface';
import { PbPaginator } from '../pb-paginator/pb-paginator';
import { PbVideoPlayer } from '../pb-video-player/pb-video-player';

@Component({
  selector: 'pb-media-lightbox',
  imports: [Icon, PbPaginator, PbVideoPlayer],
  templateUrl: './pb-media-lightbox.html',
  styleUrl: './pb-media-lightbox.scss',
  host: {
    '(document:keydown.escape)': 'close()',
  },
})
export class PbMediaLightbox {
  private readonly t = inject(LanguageService).t;
  private readonly injector = inject(Injector);

  readonly items = input.required<readonly PbMediaItem[]>();
  readonly open = model(false);
  readonly index = model(0);

  private readonly closeRef = viewChild<ElementRef<HTMLButtonElement>>('closeButton');

  protected readonly texts = computed(() => this.t().media);
  protected readonly current = computed(() => this.items()[this.index()] ?? null);

  constructor() {
    effect(() => {
      if (this.open()) {
        afterNextRender(() => this.closeRef()?.nativeElement.focus(), { injector: this.injector });
      }
    });
  }

  protected close(): void {
    this.open.set(false);
  }
}
