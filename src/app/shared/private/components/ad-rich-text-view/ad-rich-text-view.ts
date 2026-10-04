import { Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ad-rich-text-view',
  template: '<div class="ad-rich-text-view" [innerHTML]="html()"></div>',
  styleUrl: './ad-rich-text-view.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AdRichTextView {
  readonly html = input.required<string>();
}
