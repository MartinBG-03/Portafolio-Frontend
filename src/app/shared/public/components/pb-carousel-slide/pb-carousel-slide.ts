import { Component, ElementRef, inject, signal } from '@angular/core';

@Component({
  selector: 'pb-carousel-slide',
  template: '<ng-content />',
  styleUrl: './pb-carousel-slide.scss',
  host: {
    role: 'group',
    'aria-roledescription': 'slide',
    '[attr.aria-label]': 'label()',
  },
})
export class PbCarouselSlide {
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly label = signal('');
}
