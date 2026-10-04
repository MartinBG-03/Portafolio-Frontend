import { Component, input } from '@angular/core';

@Component({
  selector: 'pb-design-section',
  templateUrl: './pb-design-section.html',
  styleUrl: './pb-design-section.scss',
})
export class PbDesignSection {
  readonly anchor = input.required<string>();
  readonly heading = input.required<string>();
}
