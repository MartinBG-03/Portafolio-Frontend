import { Routes } from '@angular/router';

export const designSystemRoutes: Routes = [
  {
    path: '',
    title: 'designSystem',
    loadComponent: () =>
      import('./pages/design-system-page/design-system-page').then((m) => m.DesignSystemPage),
  },
];
