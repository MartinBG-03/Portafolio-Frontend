import { Localized } from '../../../../core/public/i18n/language';

export type ProjectCategory = 'web' | 'mobile' | 'automation';
export type ProjectFilter = ProjectCategory | 'all';

export const PROJECT_FILTERS: readonly ProjectFilter[] = ['all', 'web', 'mobile', 'automation'];

export interface Project {
  readonly id: string;
  readonly category: ProjectCategory;
  readonly date: string;
  readonly title: Localized;
  readonly description: Localized;
}

export function parseProjectFilter(value: string | null): ProjectFilter {
  return PROJECT_FILTERS.find((filter) => filter === value) ?? 'all';
}
