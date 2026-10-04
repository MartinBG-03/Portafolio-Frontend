import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../../core/public/services/language.service';
import { BreadcrumbItem } from '../../interfaces/breadcrumb-item.interface';

@Component({
  selector: 'pb-breadcrumbs',
  imports: [RouterLink],
  templateUrl: './pb-breadcrumbs.html',
  styleUrl: './pb-breadcrumbs.scss',
})
export class PbBreadcrumbs {
  private readonly t = inject(LanguageService).t;

  readonly items = input.required<readonly BreadcrumbItem[]>();
  readonly label = input<string>();

  protected readonly ariaLabel = computed(() => this.label() ?? this.t().breadcrumbs.label);
}
