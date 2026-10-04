import { AdNavModule } from '../../../shared/private/interfaces/ad-nav.interface';

export const adNavigation: readonly AdNavModule[] = [
  { key: 'dashboard', path: 'dashboard', icon: 'dashboard' },
  {
    key: 'siteAdministration',
    path: 'site-administration',
    icon: 'site-admin',
    children: [
      { key: 'navigation', path: 'navigation', icon: 'site-navigation' },
      { key: 'footer', path: 'footer', icon: 'site-footer' },
      { key: 'home', path: 'home', icon: 'site-home' },
    ],
  },
  {
    key: 'systemConfiguration',
    path: 'system-configuration',
    icon: 'system-settings',
    children: [
      { key: 'catalogs', path: 'catalogs', icon: 'catalogs' },
    ],
  },
  {
    key: 'aboutMe',
    path: 'about-me',
    icon: 'about-me',
    children: [
      { key: 'story', path: 'story', icon: 'story' },
      { key: 'stack', path: 'stack', icon: 'tech-stack' },
      { key: 'experience', path: 'experience', icon: 'experience' },
      { key: 'resume', path: 'resume', icon: 'resume' },
    ],
  },
  {
    key: 'projects',
    path: 'projects',
    icon: 'projects',
    children: [{ key: 'projectManagement', path: 'management', icon: 'project-management' }],
  },
  {
    key: 'devLog',
    path: 'dev-log',
    icon: 'devlog',
    children: [{ key: 'posts', path: 'posts', icon: 'post-management' }],
  },
  {
    key: 'devAcademy',
    path: 'dev-academy',
    icon: 'devacademy',
    children: [
      { key: 'books', path: 'books', icon: 'book-management' },
      { key: 'evaluations', path: 'evaluations', icon: 'exam-management' },
    ],
  },
  {
    key: 'contact',
    path: 'contact',
    icon: 'contact',
    children: [{ key: 'messages', path: 'messages', icon: 'messaging' }],
  },
];

export function findAdModule(url: string): AdNavModule | undefined {
  const [, area, segment] = url.split(/[?#]/)[0].split('/');
  return area === 'admin' ? adNavigation.find((module) => module.path === segment) : undefined;
}
