import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../../../core/public/services/language.service';
import { formatLongDate } from '../../../../../shared/utils/format-date-time';

@Component({
  selector: 'pb-devlog-card',
  imports: [RouterLink],
  templateUrl: './pb-devlog-card.html',
  styleUrl: './pb-devlog-card.scss',
})
export class PbDevlogCard {
  private readonly languageService = inject(LanguageService);

  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly date = input.required<string>();
  readonly coverUrl = input<string | null>(null);
  readonly category = input<string | null>(null);
  readonly path = input.required<string>();

  protected readonly texts = computed(() => this.languageService.t().devLog);
  protected readonly formattedDate = computed(() =>
    formatLongDate(this.date(), this.languageService.language()),
  );
}
