import { Routes } from '@angular/router';

export const adSystemConfigurationRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'catalogs' },
  {
    path: 'catalogs',
    title: 'admin.catalogs',
    loadComponent: () => import('./pages/catalogs-page/catalogs-page').then((m) => m.CatalogsPage),
  },
];
