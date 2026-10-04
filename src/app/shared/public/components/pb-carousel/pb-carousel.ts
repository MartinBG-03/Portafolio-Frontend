import {
  Component,
  computed,
  contentChildren,
  DestroyRef,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { Icon } from '../../../components/icon/icon';
import { CarouselLabels } from '../../interfaces/carousel-labels.interface';
import { PbCarouselSlide } from '../pb-carousel-slide/pb-carousel-slide';
import { PbIconButton } from '../pb-icon-button/pb-icon-button';

@Component({
  selector: 'pb-carousel',
  imports: [Icon, PbIconButton],
  templateUrl: './pb-carousel.html',
  styleUrl: './pb-carousel.scss',
})
export class PbCarousel {
  private readonly document = inject(DOCUMENT);

  readonly labels = input.required<CarouselLabels>();

  private readonly slides = contentChildren(PbCarouselSlide);
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private frame = 0;

  protected readonly active = signal(0);
  protected readonly indexes = computed(() => this.slides().map((_, index) => index));
  protected readonly isFirst = computed(() => this.active() <= 0);
  protected readonly isLast = computed(() => this.active() >= this.slides().length - 1);

  constructor() {
    effect(() => {
      const total = String(this.slides().length);
      const template = this.labels().slide;
      this.slides().forEach((slide, index) => {
        slide.label.set(template.replace('{current}', String(index + 1)).replace('{total}', total));
      });
    });

    inject(DestroyRef).onDestroy(() => cancelAnimationFrame(this.frame));
  }

  protected onScroll(): void {
    if (this.frame) {
      return;
    }

    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.active.set(this.nearestIndex());
    });
  }

  protected previous(): void {
    this.goTo(this.active() - 1);
  }

  protected next(): void {
    this.goTo(this.active() + 1);
  }

  protected goTo(index: number): void {
    const slide = this.slides()[index];

    if (!slide) {
      return;
    }

    const track = this.track().nativeElement;
    const element = slide.element;

    track.scrollTo({
      left: element.offsetLeft + element.offsetWidth / 2 - track.clientWidth / 2,
      behavior: this.prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }

  private nearestIndex(): number {
    const track = this.track().nativeElement;
    const center = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    let distance = Number.POSITIVE_INFINITY;

    this.slides().forEach((slide, index) => {
      const element = slide.element;
      const gap = Math.abs(element.offsetLeft + element.offsetWidth / 2 - center);

      if (gap < distance) {
        distance = gap;
        nearest = index;
      }
    });

    return nearest;
  }

  private prefersReducedMotion(): boolean {
    return (
      this.document.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
    );
  }
}
