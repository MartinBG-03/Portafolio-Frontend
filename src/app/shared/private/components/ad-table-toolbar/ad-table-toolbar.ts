import {
  booleanAttribute,
  Component,
  DestroyRef,
  inject,
  computed,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { localized } from '../../../utils/localized';
import { AD_TABLE_TEXTS } from '../../constants/ad-texts.constants';
import { AdIcon } from '../ad-icon/ad-icon';
import { AdIconButton } from '../ad-icon-button/ad-icon-button';
import { AdSearchField } from '../ad-search-field/ad-search-field';

const DEFAULT_DEBOUNCE_MS = 300;

@Component({
  selector: 'ad-table-toolbar',
  imports: [FormsModule, AdIcon, AdIconButton, AdSearchField],
  templateUrl: './ad-table-toolbar.html',
  styleUrl: './ad-table-toolbar.scss',
})
export class AdTableToolbar {
  readonly searchable = input(false, { transform: booleanAttribute });
  readonly configurable = input(false, { transform: booleanAttribute });
  readonly searchLabel = input<string>();
  readonly placeholder = input<string>();
  readonly configureLabel = input<string>();
  readonly value = input('');
  readonly debounce = input(DEFAULT_DEBOUNCE_MS);

  readonly searchChange = output<string>();
  readonly configure = output<void>();

  private readonly texts = localized(AD_TABLE_TEXTS);

  protected readonly searchText = computed(() => this.searchLabel() ?? this.texts().searchPlaceholder);
  protected readonly placeholderText = computed(
    () => this.placeholder() ?? this.texts().searchPlaceholder,
  );
  protected readonly configureText = computed(
    () => this.configureLabel() ?? this.texts().configureColumns,
  );
  protected readonly text = linkedSignal(() => this.value());

  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.cancelPending());
  }

  protected onText(value: string): void {
    this.text.set(value);
    this.cancelPending();
    this.timer = setTimeout(() => {
      this.timer = null;
      this.searchChange.emit(value);
    }, this.debounce());
  }

  protected onSubmit(value: string): void {
    this.cancelPending();
    this.text.set(value);
    this.searchChange.emit(value);
  }

  private cancelPending(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
