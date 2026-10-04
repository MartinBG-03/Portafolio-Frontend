import { Routes } from '@angular/router';

export const devLogRoutes: Routes = [
  {
    path: '',
    title: 'devLog',
    loadComponent: () =>
      import('./pages/devlog-list-page/devlog-list-page').then((m) => m.DevlogListPage),
  },
  {
    path: ':slug',
    title: 'devLog',
    loadComponent: () =>
      import('./pages/devlog-entry-page/devlog-entry-page').then((m) => m.DevlogEntryPage),
  },
];
