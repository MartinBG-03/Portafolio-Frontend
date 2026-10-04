import {
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { localized } from '../../../utils/localized';
import { AD_FILE_PICKER_TEXTS } from '../../constants/ad-media.constants';
import { AdButton } from '../ad-button/ad-button';
import { adUniqueId } from '../ad-form-field/ad-field-control';
import { AdIcon } from '../ad-icon/ad-icon';

@Component({
  selector: 'ad-file-picker',
  imports: [AdButton, AdIcon],
  templateUrl: './ad-file-picker.html',
  styleUrl: './ad-file-picker.scss',
})
export class AdFilePicker {
  readonly label = input.required<string>();
  readonly hint = input<string>();
  readonly error = input<string | null>(null);
  readonly accept = input('');
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly busy = input(false, { transform: booleanAttribute });
  readonly filled = input(false, { transform: booleanAttribute });

  readonly filesSelected = output<readonly File[]>();
  readonly filesRejected = output<readonly File[]>();

  protected readonly texts = localized(AD_FILE_PICKER_TEXTS);
  protected readonly inputId = adUniqueId('ad-file-picker');
  protected readonly hintId = `${this.inputId}-hint`;
  protected readonly dragging = signal(false);
  protected readonly blocked = computed(() => this.disabled() || this.busy());
  protected readonly promptText = computed(() => {
    if (this.busy()) {
      return this.texts().uploading;
    }
    if (this.multiple()) {
      return this.texts().drop;
    }
    return this.filled() ? this.texts().dropReplace : this.texts().dropSingle;
  });
  protected readonly buttonText = computed(() => {
    if (this.multiple()) {
      return this.texts().choose;
    }
    return this.filled() ? this.texts().replace : this.texts().chooseSingle;
  });

  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  protected browse(): void {
    if (!this.blocked()) {
      this.fileInput().nativeElement.click();
    }
  }

  protected onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.emit(target.files);
    target.value = '';
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (!this.blocked()) {
      this.dragging.set(true);
    }
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    if (!this.blocked()) {
      this.emit(event.dataTransfer?.files ?? null);
    }
  }

  private emit(list: FileList | null): void {
    const files = Array.from(list ?? []);
    const picked = this.multiple() ? files : files.slice(0, 1);
    const accepted = picked.filter((file) => this.isAccepted(file));
    const rejected = picked.filter((file) => !accepted.includes(file));

    if (rejected.length > 0) {
      this.filesRejected.emit(rejected);
    }
    if (accepted.length > 0) {
      this.filesSelected.emit(accepted);
    }
  }

  private isAccepted(file: File): boolean {
    const rules = this.accept()
      .split(',')
      .map((rule) => rule.trim().toLowerCase())
      .filter((rule) => rule.length > 0);
    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();

    return (
      rules.length === 0 ||
      rules.some((rule) => {
        if (rule.startsWith('.')) {
          return name.endsWith(rule);
        }
        if (rule.endsWith('/*')) {
          return type.startsWith(rule.slice(0, -1));
        }
        return type === rule;
      })
    );
  }
}
