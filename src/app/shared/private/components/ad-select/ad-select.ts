import { booleanAttribute, Component, computed, forwardRef, input, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { localized } from '../../../utils/localized';
import { AD_COMMON_TEXTS } from '../../constants/ad-texts.constants';
import { AdOption, AdOptionValue } from '../../interfaces/ad-option.interface';
import { AdFieldControl } from '../ad-form-field/ad-field-control';
import { AdFormField } from '../ad-form-field/ad-form-field';
import { AdIcon } from '../ad-icon/ad-icon';

@Component({
  selector: 'ad-select',
  imports: [AdFormField, AdIcon],
  templateUrl: './ad-select.html',
  styleUrl: './ad-select.scss',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AdSelect), multi: true }],
})
export class AdSelect extends AdFieldControl<AdOptionValue> {
  readonly options = input.required<readonly AdOption[]>();
  readonly openUp = input(false, { transform: booleanAttribute });

  protected readonly texts = localized(AD_COMMON_TEXTS);
  protected readonly open = signal(false);
  protected readonly activeIndex = signal(-1);

  protected readonly listboxId = `${this.controlId}-listbox`;
  protected readonly selected = computed(
    () => this.options().find((option) => option.value === this.value()) ?? null,
  );
  protected readonly activeId = computed(() =>
    this.open() && this.activeIndex() >= 0 ? this.optionId(this.activeIndex()) : null,
  );

  protected optionId(index: number): string {
    return `${this.controlId}-option-${index}`;
  }

  protected toggle(): void {
    if (this.open()) {
      this.close();
    } else {
      this.openList();
    }
  }

  protected choose(option: AdOption): void {
    if (option.disabled) {
      return;
    }
    this.commit(option.value);
    this.close();
  }

  protected onBlur(): void {
    this.close();
    this.touch();
  }

  protected onKeydown(event: KeyboardEvent): void {
    const handled = this.open() ? this.onOpenKey(event.key) : this.onClosedKey(event.key);
    if (handled) {
      event.preventDefault();
    }
  }

  protected hover(index: number): void {
    if (!this.options()[index]?.disabled) {
      this.activeIndex.set(index);
    }
  }

  private onClosedKey(key: string): boolean {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
      this.openList();
      return true;
    }
    return false;
  }

  private onOpenKey(key: string): boolean {
    switch (key) {
      case 'ArrowDown':
        this.move(1);
        return true;
      case 'ArrowUp':
        this.move(-1);
        return true;
      case 'Home':
        this.activeIndex.set(this.nextEnabled(-1, 1));
        return true;
      case 'End':
        this.activeIndex.set(this.nextEnabled(this.options().length, -1));
        return true;
      case 'Enter':
      case ' ': {
        const option = this.options()[this.activeIndex()];
        if (option) {
          this.choose(option);
        }
        return true;
      }
      case 'Escape':
        this.close();
        return true;
      default:
        return false;
    }
  }

  private openList(): void {
    if (this.isDisabled()) {
      return;
    }
    const selectedIndex = this.options().findIndex((option) => option.value === this.value());
    this.activeIndex.set(selectedIndex >= 0 ? selectedIndex : this.nextEnabled(-1, 1));
    this.open.set(true);
  }

  private close(): void {
    this.open.set(false);
  }

  private move(direction: 1 | -1): void {
    const next = this.nextEnabled(this.activeIndex(), direction);
    if (next >= 0) {
      this.activeIndex.set(next);
    }
  }

  private nextEnabled(from: number, direction: 1 | -1): number {
    const options = this.options();
    for (let index = from + direction; index >= 0 && index < options.length; index += direction) {
      if (!options[index].disabled) {
        return index;
      }
    }
    return from >= 0 && from < options.length ? from : -1;
  }
}
