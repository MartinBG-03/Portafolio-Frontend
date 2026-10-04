import { Component, input } from '@angular/core';

@Component({
  selector: 'pb-empty-state',
  templateUrl: './pb-empty-state.html',
  styleUrl: './pb-empty-state.scss',
})
export class PbEmptyState {
  readonly heading = input.required<string>();
  readonly description = input<string>();
}
