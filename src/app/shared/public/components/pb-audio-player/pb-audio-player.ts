import {
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { LanguageService } from '../../../../core/public/services/language.service';
import { MediaPlaybackService } from '../../../../core/public/services/media-playback.service';
import { Icon } from '../../../components/icon/icon';
import { formatDuration } from '../../../utils/format-duration';

const SKIP_SECONDS = 10;

@Component({
  selector: 'pb-audio-player',
  imports: [Icon],
  templateUrl: './pb-audio-player.html',
  styleUrl: './pb-audio-player.scss',
})
export class PbAudioPlayer {
  private readonly playback = inject(MediaPlaybackService);
  private readonly t = inject(LanguageService).t;
  private readonly id = this.playback.register();

  readonly src = input.required<string>();
  readonly heading = input.required<string>();
  readonly description = input<string | null>(null);

  private readonly audioRef = viewChild.required<ElementRef<HTMLAudioElement>>('audio');

  protected readonly texts = computed(() => this.t().media);
  protected readonly playing = signal(false);
  protected readonly expanded = signal(false);
  protected readonly current = signal(0);
  protected readonly duration = signal(0);
  protected readonly skipSeconds = SKIP_SECONDS;
  protected readonly descriptionId = `pb-audio-description-${String(this.id.description)}`;

  protected readonly progress = computed(() => {
    const total = this.duration();
    return total > 0 ? (this.current() / total) * 100 : 0;
  });
  protected readonly currentLabel = computed(() => formatDuration(this.current()));
  protected readonly durationLabel = computed(() => formatDuration(this.duration()));

  constructor() {
    effect(() => {
      if (this.playback.active() !== this.id && this.playing()) {
        this.audioRef().nativeElement.pause();
      }
    });

    inject(DestroyRef).onDestroy(() => this.playback.release(this.id));
  }

  protected toggle(): void {
    const audio = this.audioRef().nativeElement;
    if (audio.paused) {
      void audio.play();
    } else {
      audio.pause();
    }
  }

  protected skip(offset: number): void {
    const audio = this.audioRef().nativeElement;
    const limit = this.duration() || audio.duration || 0;
    audio.currentTime = Math.min(Math.max(audio.currentTime + offset * SKIP_SECONDS, 0), limit);
    this.current.set(audio.currentTime);
  }

  protected seek(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.audioRef().nativeElement.currentTime = value;
    this.current.set(value);
  }

  protected toggleDescription(): void {
    this.expanded.update((value) => !value);
  }

  protected onPlay(): void {
    this.playback.claim(this.id);
    this.playing.set(true);
  }

  protected onPause(): void {
    this.playing.set(false);
  }

  protected onEnded(): void {
    this.playing.set(false);
    this.playback.release(this.id);
  }

  protected onTimeUpdate(): void {
    this.current.set(this.audioRef().nativeElement.currentTime);
  }

  protected onDurationChange(): void {
    const duration = this.audioRef().nativeElement.duration;
    if (Number.isFinite(duration)) {
      this.duration.set(duration);
    }
  }
}
