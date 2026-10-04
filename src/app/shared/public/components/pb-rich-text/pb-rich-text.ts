import { Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pb-rich-text',
  template: '',
  styleUrl: './pb-rich-text.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'pb-rich-text',
    '[innerHTML]': 'html()',
  },
})
export class PbRichText {
  readonly html = input.required<string>();
}
