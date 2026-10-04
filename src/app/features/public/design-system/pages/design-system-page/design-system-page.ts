import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LanguageService } from '../../../../../core/public/services/language.service';
import { ToastService } from '../../../../../core/public/services/toast.service';
import { Translations } from '../../../../../core/public/i18n/translations';
import { Icon } from '../../../../../shared/components/icon/icon';
import { PbBreadcrumbs } from '../../../../../shared/public/components/pb-breadcrumbs/pb-breadcrumbs';
import { ButtonVariant, PbButton } from '../../../../../shared/public/components/pb-button/pb-button';
import { PbChip } from '../../../../../shared/public/components/pb-chip/pb-chip';
import {
  IconButtonVariant,
  PbIconButton,
} from '../../../../../shared/public/components/pb-icon-button/pb-icon-button';
import { PbPageHeader } from '../../../../../shared/public/components/pb-page-header/pb-page-header';
import { PbSearchField } from '../../../../../shared/public/components/pb-search-field/pb-search-field';
import { PbTextField } from '../../../../../shared/public/components/pb-text-field/pb-text-field';
import { PbTextareaField } from '../../../../../shared/public/components/pb-textarea-field/pb-textarea-field';
import { PbToast } from '../../../../../shared/public/components/pb-toast/pb-toast';
import { BreadcrumbItem } from '../../../../../shared/public/interfaces/breadcrumb-item.interface';
import { ToastVariant } from '../../../../../shared/public/interfaces/toast.interface';
import { PbDesignSection } from '../../components/pb-design-section/pb-design-section';
import { PbDesignSidebar } from '../../components/pb-design-sidebar/pb-design-sidebar';

const TOAST_DURATION_MS = 4000;

type SectionKey = keyof Translations['designSystem']['sections'];

const SECTIONS: readonly { readonly id: string; readonly key: SectionKey }[] = [
  { id: 'typography', key: 'typography' },
  { id: 'breadcrumbs', key: 'breadcrumbs' },
  { id: 'buttons', key: 'buttons' },
  { id: 'icon-buttons', key: 'iconButtons' },
  { id: 'fields', key: 'fields' },
  { id: 'search', key: 'search' },
  { id: 'notifications', key: 'toasts' },
  { id: 'chips', key: 'chips' },
  { id: 'mode', key: 'mode' },
  { id: 'headers', key: 'headers' },
];

@Component({
  selector: 'pb-design-system-page',
  imports: [
    ReactiveFormsModule,
    Icon,
    PbDesignSection,
    PbDesignSidebar,
    PbPageHeader,
    PbBreadcrumbs,
    PbButton,
    PbIconButton,
    PbTextField,
    PbTextareaField,
    PbSearchField,
    PbToast,
    PbChip,
  ],
  templateUrl: './design-system-page.html',
  styleUrl: './design-system-page.scss',
})
export class DesignSystemPage {
  private readonly toastService = inject(ToastService);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly t = inject(LanguageService).t;
  protected readonly activeId = signal(SECTIONS[0].id);

  protected readonly palette = [
    { name: 'cream', variable: '--palette-cream' },
    { name: 'navy', variable: '--palette-navy' },
    { name: 'accent', variable: '--palette-accent' },
    { name: 'gray', variable: '--palette-gray' },
    { name: 'success', variable: '--palette-success' },
    { name: 'warning', variable: '--palette-warning' },
  ] as const;

  protected readonly buttonVariants: readonly Extract<
    ButtonVariant,
    'primary' | 'secondary' | 'tertiary'
  >[] = ['primary', 'secondary', 'tertiary'];
  protected readonly iconButtonVariants: readonly IconButtonVariant[] = [
    'primary',
    'secondary',
    'neutral',
    'destructive',
  ];
  protected readonly toastVariants: readonly ToastVariant[] = [
    'success',
    'error',
    'warning',
    'info',
  ];
  protected readonly colorSchemes = ['light', 'dark'] as const;

  protected readonly tags = signal(['Angular', 'TypeScript', 'SCSS']);
  protected readonly disabledControl = new FormControl({ value: '', disabled: true });

  protected readonly breadcrumbs = computed<readonly BreadcrumbItem[]>(() => [
    { label: this.t().nav.home, path: '/' },
    { label: this.t().nav.designSystem },
  ]);

  protected readonly sampleBreadcrumbs = computed<readonly BreadcrumbItem[]>(() => [
    { label: this.t().nav.home, path: '/' },
    { label: this.t().nav.projects, path: '/projects' },
    { label: 'E-commerce' },
  ]);

  protected readonly headerBreadcrumbs = computed<readonly BreadcrumbItem[]>(() => [
    { label: this.t().nav.home, path: '/' },
    { label: this.t().designSystem.header.heading },
  ]);

  protected readonly sectionLinks = computed(() => {
    const labels = this.t().designSystem.sections;
    return SECTIONS.map(({ id, key }) => ({ id, label: labels[key] }));
  });

  constructor() {
    afterNextRender(() => this.trackVisibleSection());
  }

  protected scrollTo(id: string): void {
    const target = this.document.getElementById(id);
    const reduceMotion = this.document.defaultView?.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    target?.scrollIntoView?.({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    this.activeId.set(id);
  }

  protected removeTag(tag: string): void {
    this.tags.update((tags) => tags.filter((current) => current !== tag));
  }

  protected showToast(variant: ToastVariant): void {
    const sample = this.t().designSystem.toasts[variant];
    this.toastService.show({
      variant,
      title: sample.title,
      description: sample.description,
      duration: TOAST_DURATION_MS,
    });
  }

  private trackVisibleSection(): void {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (first) {
          this.activeId.set(first.target.id);
        }
      },
      { rootMargin: '-20% 0px -65% 0px' },
    );

    for (const { id } of SECTIONS) {
      const section = this.document.getElementById(id);
      if (section) {
        observer.observe(section);
      }
    }
    this.destroyRef.onDestroy(() => observer.disconnect());
  }
}
