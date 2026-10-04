import { Component, input } from '@angular/core';
import { Icon } from '../../../../../shared/components/icon/icon';

@Component({
  selector: 'pb-document-card',
  imports: [Icon],
  templateUrl: './pb-document-card.html',
  styleUrl: './pb-document-card.scss',
})
export class PbDocumentCard {
  readonly heading = input.required<string>();
  readonly description = input.required<string>();
  readonly meta = input.required<string>();
  readonly href = input.required<string>();
  readonly downloadLabel = input.required<string>();
}
