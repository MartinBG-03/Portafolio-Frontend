import { Component, computed, inject, input } from '@angular/core';
import { LanguageService } from '../../../../core/public/services/language.service';
import { Icon } from '../../../components/icon/icon';
import { formatFileSize } from '../../../utils/format-file-size';
import { PbButton } from '../pb-button/pb-button';

const EXTENSION_TONES: Readonly<Record<string, string>> = {
  pdf: 'red',
  doc: 'blue',
  docx: 'blue',
  xls: 'green',
  xlsx: 'green',
  csv: 'green',
  ppt: 'orange',
  pptx: 'orange',
  zip: 'purple',
  rar: 'purple',
};

@Component({
  selector: 'pb-document-card',
  imports: [Icon, PbButton],
  templateUrl: './pb-document-card.html',
  styleUrl: './pb-document-card.scss',
})
export class PbDocumentCard {
  private readonly t = inject(LanguageService).t;

  readonly heading = input.required<string>();
  readonly description = input<string | null>(null);
  readonly fileName = input.required<string>();
  readonly url = input.required<string>();
  readonly sizeBytes = input<number | null>(null);

  protected readonly texts = computed(() => this.t().media);

  protected readonly extension = computed(() => {
    const name = this.fileName();
    const dot = name.lastIndexOf('.');
    return dot >= 0 ? name.slice(dot + 1).toLowerCase() : '';
  });

  protected readonly tone = computed(() => EXTENSION_TONES[this.extension()] ?? 'gray');

  protected readonly meta = computed(() => {
    const size = this.sizeBytes();
    const extension = this.extension().toUpperCase();
    return size === null ? extension : `${extension} · ${formatFileSize(size)}`;
  });
}
