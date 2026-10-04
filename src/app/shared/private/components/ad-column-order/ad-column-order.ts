import { Component, computed, input, output, signal } from '@angular/core';
import { localized } from '../../../utils/localized';
import { AD_TABLE_TEXTS } from '../../constants/ad-texts.constants';
import { AdTableColumn } from '../../interfaces/ad-table.interface';
import { AdIcon } from '../ad-icon/ad-icon';
import { AdIconButton } from '../ad-icon-button/ad-icon-button';

@Component({
  selector: 'ad-column-order',
  imports: [AdIcon, AdIconButton],
  templateUrl: './ad-column-order.html',
  styleUrl: './ad-column-order.scss',
})
export class AdColumnOrder<T> {
  readonly columns = input.required<readonly AdTableColumn<T>[]>();
  readonly label = input<string>();

  readonly orderChange = output<readonly string[]>();

  protected readonly texts = localized(AD_TABLE_TEXTS);

  protected readonly labelText = computed(() => this.label() ?? this.texts().columnOrder);
  protected readonly dragging = signal<string | null>(null);
  protected readonly over = signal<string | null>(null);

  protected moveBy(index: number, offset: -1 | 1): void {
    this.move(index, index + offset);
  }

  protected startDrag(event: DragEvent, key: string): void {
    this.dragging.set(key);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', key);
    }
  }

  protected dragOver(event: DragEvent, key: string): void {
    if (this.dragging() !== null) {
      event.preventDefault();
      this.over.set(key);
    }
  }

  protected drop(event: DragEvent, targetKey: string): void {
    event.preventDefault();
    const sourceKey = this.dragging();
    if (sourceKey !== null) {
      const keys = this.keys();
      this.move(keys.indexOf(sourceKey), keys.indexOf(targetKey));
    }
    this.endDrag();
  }

  protected endDrag(): void {
    this.dragging.set(null);
    this.over.set(null);
  }

  private keys(): string[] {
    return this.columns().map((column) => column.key);
  }

  private move(from: number, to: number): void {
    const keys = this.keys();
    if (from < 0 || to < 0 || to >= keys.length || from === to) {
      return;
    }
    const [moved] = keys.splice(from, 1);
    keys.splice(to, 0, moved);
    this.orderChange.emit(keys);
  }
}
