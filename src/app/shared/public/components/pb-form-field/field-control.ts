import { booleanAttribute, computed, Directive, input, signal } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

let nextFieldId = 0;

export function fieldMessageId(controlId: string, kind: 'error' | 'hint'): string {
  return `${controlId}-${kind}`;
}

@Directive()
export abstract class ControlAccessor<T> implements ControlValueAccessor {
  protected readonly value = signal<T | null>(null);
  protected readonly disabled = signal(false);

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
    this.disabled.set(isDisabled);
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
export abstract class FieldControl<T> extends ControlAccessor<T> {
  readonly label = input.required<string>();
  readonly placeholder = input('');
  readonly hint = input<string>();
  readonly error = input<string | null>(null);
  readonly required = input(false, { transform: booleanAttribute });

  protected readonly controlId = `pb-field-${nextFieldId++}`;

  protected readonly describedBy = computed(() => {
    if (this.error()) {
      return fieldMessageId(this.controlId, 'error');
    }
    return this.hint() ? fieldMessageId(this.controlId, 'hint') : null;
  });
}
