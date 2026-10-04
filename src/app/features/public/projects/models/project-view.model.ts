import { Language } from '../../../../core/public/i18n/language';
import { Project, ProjectCategory } from './project.model';

export interface ProjectView {
  readonly id: string;
  readonly category: ProjectCategory;
  readonly date: string;
  readonly categoryLabel: string;
  readonly title: string;
  readonly description: string;
}

export function toProjectView(
  project: Project,
  language: Language,
  categories: Readonly<Record<ProjectCategory, string>>,
): ProjectView {
  return {
    id: project.id,
    category: project.category,
    date: project.date,
    categoryLabel: categories[project.category],
    title: project.title[language],
    description: project.description[language],
  };
}
