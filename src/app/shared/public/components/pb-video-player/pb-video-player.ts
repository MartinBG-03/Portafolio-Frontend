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
import { formatDuration } from '../../../utils/format-duration';
import { Icon } from '../../../components/icon/icon';

const SKIP_SECONDS = 10;
const DURATION_PROBE = 1e101;

@Component({
  selector: 'pb-video-player',
  imports: [Icon],
  templateUrl: './pb-video-player.html',
  styleUrl: './pb-video-player.scss',
})
export class PbVideoPlayer {
  private readonly playback = inject(MediaPlaybackService);
  private readonly t = inject(LanguageService).t;
  private readonly id = this.playback.register();

  readonly src = input.required<string>();
  readonly poster = input<string | null>(null);
  readonly label = input<string>('');

  private readonly videoRef = viewChild.required<ElementRef<HTMLVideoElement>>('video');

  protected readonly texts = computed(() => this.t().media);
  protected readonly playing = signal(false);
  protected readonly started = signal(false);
  protected readonly muted = signal(false);
  protected readonly current = signal(0);
  protected readonly duration = signal(0);
  private probing = false;

  protected readonly progress = computed(() => {
    const total = this.duration();
    return total > 0 ? (this.current() / total) * 100 : 0;
  });
  protected readonly currentLabel = computed(() => formatDuration(this.current()));
  protected readonly durationLabel = computed(() => formatDuration(this.duration()));

  constructor() {
    effect(() => {
      if (this.playback.active() !== this.id && this.playing()) {
        this.videoRef().nativeElement.pause();
      }
    });

    effect(() => {
      this.src();
      this.playing.set(false);
      this.started.set(false);
      this.current.set(0);
      this.duration.set(0);
    });

    inject(DestroyRef).onDestroy(() => this.playback.release(this.id));
  }

  protected toggle(): void {
    const video = this.videoRef().nativeElement;
    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  }

  protected skip(offset: number): void {
    const video = this.videoRef().nativeElement;
    const limit = this.duration() || video.duration || 0;
    video.currentTime = Math.min(Math.max(video.currentTime + offset * SKIP_SECONDS, 0), limit);
  }

  protected seek(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.videoRef().nativeElement.currentTime = value;
    this.current.set(value);
  }

  protected toggleMute(): void {
    const video = this.videoRef().nativeElement;
    video.muted = !video.muted;
    this.muted.set(video.muted);
  }

  protected onPlay(): void {
    this.playback.claim(this.id);
    this.playing.set(true);
    this.started.set(true);
  }

  protected onPause(): void {
    this.playing.set(false);
  }

  protected onEnded(): void {
    this.playing.set(false);
    this.playback.release(this.id);
  }

  protected onMetadata(): void {
    const video = this.videoRef().nativeElement;
    if (Number.isFinite(video.duration)) {
      this.duration.set(video.duration);
      return;
    }
    this.probing = true;
    video.currentTime = DURATION_PROBE;
  }

  protected onTimeUpdate(): void {
    const video = this.videoRef().nativeElement;
    if (this.probing) {
      if (Number.isFinite(video.duration)) {
        this.probing = false;
        this.duration.set(video.duration);
        video.currentTime = 0;
      }
      return;
    }
    this.current.set(video.currentTime);
  }

  protected onDurationChange(): void {
    const video = this.videoRef().nativeElement;
    if (Number.isFinite(video.duration) && !this.probing) {
      this.duration.set(video.duration);
    }
  }

  protected readonly skipSeconds = SKIP_SECONDS;
}
