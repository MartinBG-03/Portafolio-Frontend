import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  contentChildren,
  input,
  linkedSignal,
  model,
  output,
} from '@angular/core';
import { localized } from '../../../utils/localized';
import { AD_WIZARD_TEXTS } from '../../constants/ad-wizard.constants';
import { AdWizardStep } from '../../interfaces/ad-wizard.interface';
import { AdButton } from '../ad-button/ad-button';
import { AdIcon } from '../ad-icon/ad-icon';
import { AdWizardStepContent } from './ad-wizard-step';

@Component({
  selector: 'ad-wizard',
  imports: [NgTemplateOutlet, AdButton, AdIcon],
  templateUrl: './ad-wizard.html',
  styleUrl: './ad-wizard.scss',
})
export class AdWizard {
  readonly steps = input.required<readonly AdWizardStep[]>();
  readonly label = input.required<string>();
  readonly layout = input<'top' | 'side'>('top');
  readonly linear = input(true, { transform: booleanAttribute });
  readonly busy = input(false, { transform: booleanAttribute });
  readonly finishLabel = input<string>();
  readonly cancelLabel = input<string>();
  readonly validateStep = input<((key: string) => boolean) | null>(null);

  readonly active = model<string>('');

  readonly finished = output<void>();
  readonly cancelled = output<void>();

  protected readonly texts = localized(AD_WIZARD_TEXTS);

  private readonly contents = contentChildren(AdWizardStepContent);

  protected readonly finishText = computed(() => this.finishLabel() ?? this.texts().finish);
  protected readonly cancelText = computed(() => this.cancelLabel() ?? this.texts().cancel);
  protected readonly currentIndex = computed(() =>
    Math.max(
      0,
      this.steps().findIndex((step) => step.key === this.active()),
    ),
  );
  protected readonly current = computed<AdWizardStep | undefined>(() => this.steps()[this.currentIndex()]);
  protected readonly isFirst = computed(() => this.currentIndex() === 0);
  protected readonly isLast = computed(() => this.currentIndex() === this.steps().length - 1);
  protected readonly template = computed(
    () => this.contents().find((content) => content.key() === this.current()?.key)?.template ?? null,
  );

  private readonly furthest = linkedSignal(() => (this.linear() ? 0 : this.steps().length - 1));

  protected isReachable(index: number): boolean {
    return index <= Math.max(this.furthest(), this.currentIndex());
  }

  protected isComplete(index: number): boolean {
    return index < this.currentIndex() || (index <= this.furthest() && index !== this.currentIndex());
  }

  protected goTo(index: number): void {
    if (index === this.currentIndex() || !this.isReachable(index)) {
      return;
    }
    if (index > this.currentIndex() && !this.validate()) {
      return;
    }
    this.active.set(this.steps()[index].key);
  }

  protected next(): void {
    if (!this.validate()) {
      return;
    }
    const index = this.currentIndex() + 1;
    this.furthest.update((furthest) => Math.max(furthest, index));
    this.active.set(this.steps()[index].key);
  }

  protected previous(): void {
    if (!this.isFirst()) {
      this.active.set(this.steps()[this.currentIndex() - 1].key);
    }
  }

  protected finish(): void {
    if (this.validate()) {
      this.finished.emit();
    }
  }

  private validate(): boolean {
    const step = this.current();
    const validate = this.validateStep();
    return !step || !validate || validate(step.key);
  }
}
