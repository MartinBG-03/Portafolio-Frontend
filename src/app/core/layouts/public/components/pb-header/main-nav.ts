import { Language } from '../../../../public/i18n/language';
import { Translations } from '../../../../public/i18n/translations';
import { PROJECTS } from '../../../../../features/public/projects/data/projects.data';
import { PROJECT_FILTERS } from '../../../../../features/public/projects/models/project.model';
import {
  MainNavItem,
  NavMenuAction,
  NavMenuCategory,
} from '../../../../../shared/public/interfaces/main-nav-item.interface';

const MENU_PREVIEW_LIMIT = 3;

function buildAboutCategories(t: Translations): readonly NavMenuCategory[] {
  const about = t.menus.about;
  const cvActions: readonly NavMenuAction[] = [
    { label: about.cv.es, href: 'cv/cv-es.pdf', download: true, variant: 'primary' },
    { label: about.cv.en, href: 'cv/cv-en.pdf', download: true, variant: 'secondary' },
  ];

  return [
    {
      id: 'story',
      title: about.story.title,
      path: '/about/story',
      more: { label: about.story.more, path: '/about/story' },
      panel: {
        kind: 'story',
        photoLabel: about.photo,
        quote: about.quote,
        description: about.story.description,
        actions: cvActions,
      },
    },
    {
      id: 'experience',
      title: about.experience.title,
      path: '/about/experience',
      more: { label: about.experience.more, path: '/about/experience' },
      panel: { kind: 'timeline', entries: about.experience.entries },
    },
    {
      id: 'stack',
      title: about.stack.title,
      path: '/about/stack',
      more: { label: about.stack.more, path: '/about/stack' },
      panel: { kind: 'chips', groups: about.stack.groups },
    },
  ];
}

function buildProjectCategories(t: Translations, language: Language): readonly NavMenuCategory[] {
  const categories = t.projects.categories;
  const latest = [...PROJECTS].sort((a, b) => b.date.localeCompare(a.date));

  return PROJECT_FILTERS.map((filter) => {
    const projects = latest.filter((project) => filter === 'all' || project.category === filter);
    return {
      id: filter,
      title: categories[filter],
      count: projects.length,
      path: '/projects',
      queryParams: filter === 'all' ? undefined : { category: filter },
      more: { label: t.menus.projects.footer, path: '/projects' },
      panel: {
        kind: 'projects',
        imageLabel: t.projects.imagePlaceholder,
        emptyLabel: t.menus.projects.empty,
        items: projects.slice(0, MENU_PREVIEW_LIMIT).map((project) => ({
          id: project.id,
          title: project.title[language],
          description: project.description[language],
          tone: project.category,
          path: '/projects',
          queryParams: { category: project.category },
        })),
      },
    };
  });
}

export function buildMainNav(t: Translations, language: Language): readonly MainNavItem[] {
  return [
    { id: 'home', label: t.nav.home, path: '/', exact: true },
    {
      id: 'about',
      label: t.nav.about,
      path: '/about',
      menu: { categories: buildAboutCategories(t) },
    },
    {
      id: 'projects',
      label: t.nav.projects,
      path: '/projects',
      menu: { categories: buildProjectCategories(t, language) },
    },
    { id: 'academy', label: t.nav.academy, path: '/academy' },
    { id: 'dev-log', label: t.nav.devLog, path: '/dev-log' },
    { id: 'design-system', label: t.nav.designSystem, path: '/design-system' },
    { id: 'contact', label: t.nav.contact, path: '/contact' },
  ];
}
