import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { localized } from '../../../utils/localized';
import {
  AD_FILTER_MATCH_MODES,
  AD_FILTER_MAX_RULES,
  AD_FILTER_OPERATORS,
  AD_FILTER_TEXTS,
} from '../../constants/ad-filter.constants';
import {
  AdColumnFilterConfig,
  AdColumnFilterValue,
  AdFilterMatchMode,
  AdFilterOperator,
} from '../../interfaces/ad-filter.interface';
import { AdOptionValue } from '../../interfaces/ad-option.interface';
import { AdButton } from '../ad-button/ad-button';
import { AdDateField } from '../ad-date-field/ad-date-field';
import { AdIcon } from '../ad-icon/ad-icon';
import { AdIconButton } from '../ad-icon-button/ad-icon-button';
import { AdNumberField } from '../ad-number-field/ad-number-field';
import { AdSelect } from '../ad-select/ad-select';
import { AdTextField } from '../ad-text-field/ad-text-field';

const PANEL_GAP = 4;
const VIEWPORT_MARGIN = 8;

interface DraftRule {
  readonly id: number;
  readonly operator: AdFilterOperator;
  readonly value: string;
}

@Component({
  selector: 'ad-column-filter',
  imports: [
    FormsModule,
    AdButton,
    AdDateField,
    AdIcon,
    AdIconButton,
    AdNumberField,
    AdSelect,
    AdTextField,
  ],
  templateUrl: './ad-column-filter.html',
  styleUrl: './ad-column-filter.scss',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(window:resize)': 'close()',
  },
})
export class AdColumnFilter {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);

  readonly column = input.required<string>();
  readonly field = input.required<string>();
  readonly config = input.required<AdColumnFilterConfig>();
  readonly value = input<AdColumnFilterValue | null>(null);

  readonly applied = output<AdColumnFilterValue | null>();

  protected readonly texts = localized(AD_FILTER_TEXTS);
  protected readonly matchModes = localized(AD_FILTER_MATCH_MODES);
  private readonly operatorsByType = localized(AD_FILTER_OPERATORS);
  protected readonly maxRules = AD_FILTER_MAX_RULES;

  protected readonly open = signal(false);
  protected readonly position = signal({ top: 0, left: 0 });
  protected readonly matchMode = signal<AdFilterMatchMode>('all');
  protected readonly rules = signal<readonly DraftRule[]>([]);

  protected readonly active = computed(() => (this.value()?.rules.length ?? 0) > 0);
  protected readonly operators = computed(() => this.operatorsByType()[this.config().type]);
  protected readonly options = computed(() => this.config().options ?? []);

  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private nextRuleId = 1;
  private anchor: DOMRect | null = null;
  private readonly closeWhenAnchorMoves = (): void => {
    const current = this.trigger()?.getBoundingClientRect();
    const origin = this.anchor;
    if (
      !current ||
      !origin ||
      Math.abs(current.top - origin.top) > 1 ||
      Math.abs(current.left - origin.left) > 1
    ) {
      this.close();
    }
  };

  constructor() {
    inject(DestroyRef).onDestroy(() => this.detachScrollListener());
  }

  protected toggle(): void {
    if (this.open()) {
      this.close();
    } else {
      this.show();
    }
  }

  protected setMatchMode(value: AdOptionValue | null): void {
    this.matchMode.set(value === 'any' ? 'any' : 'all');
  }

  protected setOperator(id: number, value: AdOptionValue | null): void {
    const operator = this.operators().find((option) => option.value === value)?.value;
    if (operator) {
      this.updateRule(id, { operator });
    }
  }

  protected setValue(id: number, value: AdOptionValue | null | undefined): void {
    this.updateRule(id, { value: value === null || value === undefined ? '' : String(value) });
  }

  protected numberOf(value: string): number | null {
    const parsed = Number(value);
    return value === '' || Number.isNaN(parsed) ? null : parsed;
  }

  protected addRule(): void {
    if (this.rules().length < this.maxRules) {
      this.rules.update((rules) => [...rules, this.newRule()]);
    }
  }

  protected removeRule(id: number): void {
    this.rules.update((rules) => rules.filter((rule) => rule.id !== id));
  }

  protected apply(): void {
    const rules = this.rules()
      .map(({ operator, value }) => ({ operator, value: value.trim() }))
      .filter((rule) => rule.value !== '');

    this.applied.emit(
      rules.length > 0 ? { field: this.field(), matchMode: this.matchMode(), rules } : null,
    );
    this.close(true);
  }

  protected clear(): void {
    this.applied.emit(null);
    this.close(true);
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  protected close(refocus = false): void {
    if (!this.open()) {
      return;
    }
    this.open.set(false);
    this.detachScrollListener();
    if (refocus) {
      this.trigger()?.focus();
    }
  }

  private show(): void {
    const trigger = this.trigger();
    if (!trigger) {
      return;
    }

    const current = this.value();
    this.matchMode.set(current?.matchMode ?? 'all');
    this.rules.set(
      current && current.rules.length > 0
        ? current.rules.map((rule) => ({ id: this.nextRuleId++, ...rule }))
        : [this.newRule()],
    );

    const anchor = trigger.getBoundingClientRect();
    this.position.set({ top: anchor.bottom + PANEL_GAP, left: anchor.left });
    this.open.set(true);
    this.anchor = anchor;
    this.document.addEventListener('scroll', this.closeWhenAnchorMoves, {
      capture: true,
      passive: true,
    });

    afterNextRender(() => this.keepInsideViewport(anchor), { injector: this.injector });
  }

  private newRule(): DraftRule {
    return { id: this.nextRuleId++, operator: this.operators()[0].value, value: '' };
  }

  private updateRule(id: number, change: Partial<Omit<DraftRule, 'id'>>): void {
    this.rules.update((rules) => rules.map((rule) => (rule.id === id ? { ...rule, ...change } : rule)));
  }

  private keepInsideViewport(anchor: DOMRect): void {
    const panel = this.panel()?.nativeElement;
    const view = this.document.defaultView;
    if (!panel || !view) {
      return;
    }

    const { width, height } = panel.getBoundingClientRect();
    let { left } = anchor;
    let top = anchor.bottom + PANEL_GAP;

    if (left + width > view.innerWidth - VIEWPORT_MARGIN) {
      left = Math.max(VIEWPORT_MARGIN, view.innerWidth - width - VIEWPORT_MARGIN);
    }
    if (top + height > view.innerHeight - VIEWPORT_MARGIN) {
      top = Math.max(VIEWPORT_MARGIN, anchor.top - height - PANEL_GAP);
    }

    this.position.set({ top, left });
  }

  private trigger(): HTMLButtonElement | null {
    return this.host.nativeElement.querySelector<HTMLButtonElement>(
      '.ad-column-filter__trigger button',
    );
  }

  private detachScrollListener(): void {
    this.document.removeEventListener('scroll', this.closeWhenAnchorMoves, { capture: true });
    this.anchor = null;
  }
}
