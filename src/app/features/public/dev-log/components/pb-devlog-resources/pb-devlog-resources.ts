import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { LanguageService } from '../../../../../core/public/services/language.service';
import { PbAudioPlayer } from '../../../../../shared/public/components/pb-audio-player/pb-audio-player';
import { PbDocumentCard } from '../../../../../shared/public/components/pb-document-card/pb-document-card';
import { PbMediaCarousel } from '../../../../../shared/public/components/pb-media-carousel/pb-media-carousel';
import { PbPaginator } from '../../../../../shared/public/components/pb-paginator/pb-paginator';
import { PbMediaItem } from '../../../../../shared/public/interfaces/media-item.interface';
import {
  DevLogAudioView,
  DevLogDocumentView,
  DevLogResource,
} from '../../models/devlog-entry.model';

const DOCUMENTS_PER_PAGE = 2;
const AUDIOS_PER_PAGE = 3;

function pageOf<T>(items: readonly T[], page: number, size: number): readonly T[] {
  return items.slice(page * size, page * size + size);
}

@Component({
  selector: 'pb-devlog-resources',
  imports: [PbMediaCarousel, PbDocumentCard, PbAudioPlayer, PbPaginator],
  templateUrl: './pb-devlog-resources.html',
  styleUrl: './pb-devlog-resources.scss',
})
export class PbDevlogResources {
  private readonly languageService = inject(LanguageService);

  readonly resources = input.required<readonly DevLogResource[]>();

  protected readonly texts = computed(() => this.languageService.t().devLog.resources);
  protected readonly documentPage = signal(0);
  protected readonly audioPage = signal(0);

  private readonly visible = computed(() => this.resources().filter((resource) => resource.status));

  protected readonly media = computed<readonly PbMediaItem[]>(() => {
    const language = this.languageService.language();
    return this.visible()
      .filter((resource) => resource.type === 'image' || resource.type === 'video')
      .map((resource) => ({
        id: resource.id,
        kind: resource.type === 'video' ? 'video' : 'image',
        src: resource.url,
        poster: resource.poster ?? null,
        title: resource.title[language],
        body: resource.body?.[language] ?? null,
      }));
  });

  protected readonly documents = computed<readonly DevLogDocumentView[]>(() => {
    const language = this.languageService.language();
    return this.visible()
      .filter((resource) => resource.type === 'document')
      .map((resource) => ({
        id: resource.id,
        title: resource.title[language],
        body: resource.body?.[language] ?? null,
        fileName: resource.fileName,
        url: resource.url,
        sizeBytes: resource.sizeBytes ?? null,
      }));
  });

  protected readonly audios = computed<readonly DevLogAudioView[]>(() => {
    const language = this.languageService.language();
    return this.visible()
      .filter((resource) => resource.type === 'audio')
      .map((resource) => ({
        id: resource.id,
        title: resource.title[language],
        body: resource.body?.[language] ?? null,
        url: resource.url,
      }));
  });

  protected readonly documentPages = computed(() => Math.ceil(this.documents().length / DOCUMENTS_PER_PAGE));
  protected readonly audioPages = computed(() => Math.ceil(this.audios().length / AUDIOS_PER_PAGE));
  protected readonly visibleDocuments = computed(() =>
    pageOf(this.documents(), this.documentPage(), DOCUMENTS_PER_PAGE),
  );
  protected readonly visibleAudios = computed(() =>
    pageOf(this.audios(), this.audioPage(), AUDIOS_PER_PAGE),
  );
  protected readonly hasAny = computed(
    () => this.media().length + this.documents().length + this.audios().length > 0,
  );

  constructor() {
    effect(() => {
      this.resources();
      this.documentPage.set(0);
      this.audioPage.set(0);
    });
  }
}
