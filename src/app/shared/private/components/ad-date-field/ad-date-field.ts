import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { LanguageService } from '../../../../core/public/services/language.service';
import { localized } from '../../../utils/localized';
import { AD_DATE_TEXTS } from '../../constants/ad-texts.constants';
import {
  addDays,
  addMonths,
  CalendarDay,
  formatDisplay,
  IsoDate,
  longDateLabel,
  monthGrid,
  monthLabel,
  parseDisplay,
  todayIso,
  weekdayIndex,
  WEEKDAY_LETTERS,
} from '../../../utils/iso-date';
import { adFieldMessageId, AdFieldControl } from '../ad-form-field/ad-field-control';
import { AdFormField } from '../ad-form-field/ad-form-field';
import { AdButton } from '../ad-button/ad-button';
import { AdIcon } from '../ad-icon/ad-icon';
import { AdIconButton } from '../ad-icon-button/ad-icon-button';

@Component({
  selector: 'ad-date-field',
  imports: [AdFormField, AdIcon, AdIconButton, AdButton],
  templateUrl: './ad-date-field.html',
  styleUrl: './ad-date-field.scss',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AdDateField), multi: true },
  ],
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'onEscape()',
  },
})
export class AdDateField extends AdFieldControl<IsoDate> {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly language = inject(LanguageService).language;

  readonly min = input<IsoDate>();
  readonly max = input<IsoDate>();

  protected readonly texts = localized(AD_DATE_TEXTS);
  protected readonly weekdays = computed(() => WEEKDAY_LETTERS[this.language()]);
  protected readonly today = todayIso();

  protected readonly open = signal(false);
  protected readonly text = signal('');
  protected readonly invalidText = signal(false);
  protected readonly viewDate = signal<IsoDate>(this.today);
  protected readonly focusedDate = signal<IsoDate>(this.today);

  protected readonly grid = computed(() => monthGrid(this.viewDate()));
  protected readonly monthTitle = computed(() => monthLabel(this.viewDate(), this.language()));
  protected readonly shownError = computed(
    () => this.error() ?? (this.invalidText() ? this.texts().invalid : null),
  );
  protected readonly describedByDate = computed(() => {
    if (this.shownError()) {
      return adFieldMessageId(this.controlId, 'error');
    }
    return this.hint() ? adFieldMessageId(this.controlId, 'hint') : null;
  });

  override writeValue(value: IsoDate | null): void {
    super.writeValue(value);
    this.text.set(formatDisplay(value));
    this.invalidText.set(false);
  }

  protected onTextInput(event: Event): void {
    this.text.set((event.target as HTMLInputElement).value);
    this.invalidText.set(false);
  }

  protected onTextCommit(): void {
    const typed = this.text().trim();
    if (typed === '') {
      this.commit(null);
      return;
    }

    const iso = parseDisplay(typed);
    if (iso && !this.isDisabledDay(iso)) {
      this.text.set(formatDisplay(iso));
      this.commit(iso);
      return;
    }
    this.invalidText.set(true);
  }

  protected onBlur(): void {
    this.touch();
  }

  protected toggle(): void {
    if (this.open()) {
      this.close(true);
      return;
    }
    if (this.isDisabled()) {
      return;
    }

    const start = this.clampToRange(this.value() ?? this.today);
    this.viewDate.set(start);
    this.focusedDate.set(start);
    this.open.set(true);
    this.focusDay();
  }

  protected pick(day: CalendarDay): void {
    if (this.isDisabledDay(day.iso)) {
      return;
    }
    this.select(day.iso);
  }

  protected pickToday(): void {
    if (!this.isDisabledDay(this.today)) {
      this.select(this.today);
    }
  }

  protected clearDate(): void {
    this.text.set('');
    this.invalidText.set(false);
    this.commit(null);
    this.close(true);
  }

  protected shiftMonth(delta: number): void {
    this.viewDate.update((date) => addMonths(date, delta));
    this.focusedDate.update((date) => addMonths(date, delta));
  }

  protected onGridKeydown(event: KeyboardEvent): void {
    const target = this.targetFor(event.key, this.focusedDate());
    if (target === null) {
      return;
    }

    event.preventDefault();
    this.focusedDate.set(target);
    this.viewDate.set(target);
    this.focusDay();
  }

  protected isDisabledDay(iso: IsoDate): boolean {
    const min = this.min();
    const max = this.max();
    return (min !== undefined && iso < min) || (max !== undefined && iso > max);
  }

  protected dayLabel(iso: IsoDate): string {
    return longDateLabel(iso, this.language());
  }

  protected onDocumentClick(event: Event): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.close(false);
    }
  }

  protected onEscape(): void {
    if (this.open()) {
      this.close(true);
    }
  }

  private select(iso: IsoDate): void {
    this.text.set(formatDisplay(iso));
    this.invalidText.set(false);
    this.commit(iso);
    this.close(true);
  }

  private close(returnFocus: boolean): void {
    this.open.set(false);
    if (returnFocus) {
      this.host.nativeElement.querySelector<HTMLElement>('.ad-date-field__toggle')?.focus();
    }
  }

  private clampToRange(iso: IsoDate): IsoDate {
    const min = this.min();
    const max = this.max();
    if (min !== undefined && iso < min) {
      return min;
    }
    return max !== undefined && iso > max ? max : iso;
  }

  private focusDay(): void {
    afterNextRender(
      () =>
        this.host.nativeElement
          .querySelector<HTMLElement>('.ad-date-field__day[tabindex="0"]')
          ?.focus(),
      { injector: this.injector },
    );
  }

  private targetFor(key: string, from: IsoDate): IsoDate | null {
    switch (key) {
      case 'ArrowLeft':
        return addDays(from, -1);
      case 'ArrowRight':
        return addDays(from, 1);
      case 'ArrowUp':
        return addDays(from, -7);
      case 'ArrowDown':
        return addDays(from, 7);
      case 'Home':
        return addDays(from, -weekdayIndex(from));
      case 'End':
        return addDays(from, 6 - weekdayIndex(from));
      case 'PageUp':
        return addMonths(from, -1);
      case 'PageDown':
        return addMonths(from, 1);
      default:
        return null;
    }
  }
}
