import { booleanAttribute, computed, Directive, input, signal } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

let nextId = 0;

export function adUniqueId(prefix: string): string {
  return `${prefix}-${nextId++}`;
}

export function adFieldMessageId(controlId: string, kind: 'error' | 'hint'): string {
  return `${controlId}-${kind}`;
}

export function adFieldLabelId(controlId: string): string {
  return `${controlId}-label`;
}

@Directive()
export abstract class AdControlAccessor<T> implements ControlValueAccessor {
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly value = signal<T | null>(null);
  private readonly disabledByForm = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.disabledByForm());

  private onChange: (value: T | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: T | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledByForm.set(isDisabled);
  }

  protected commit(value: T | null): void {
    this.value.set(value);
    this.onChange(value);
  }

  protected touch(): void {
    this.onTouched();
  }
}

@Directive()
export abstract class AdFieldControl<T> extends AdControlAccessor<T> {
  readonly label = input.required<string>();
  readonly placeholder = input('');
  readonly hint = input<string>();
  readonly error = input<string | null>(null);
  readonly required = input(false, { transform: booleanAttribute });
  readonly labelHidden = input(false, { transform: booleanAttribute });
  readonly optional = input(false, { transform: booleanAttribute });

  protected readonly controlId = adUniqueId('ad-field');

  protected readonly describedBy = computed(() => {
    if (this.error()) {
      return adFieldMessageId(this.controlId, 'error');
    }
    return this.hint() ? adFieldMessageId(this.controlId, 'hint') : null;
  });
}
