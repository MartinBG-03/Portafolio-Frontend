import { Component, input } from '@angular/core';

@Component({
  selector: 'pb-spaced-heading',
  templateUrl: './pb-spaced-heading.html',
  styleUrl: './pb-spaced-heading.scss',
})
export class PbSpacedHeading {
  readonly heading = input.required<string>();
  readonly description = input<string>();
}
