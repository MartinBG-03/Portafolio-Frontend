import { Routes } from '@angular/router';

export const homeRoutes: Routes = [
  {
    path: '',
    title: 'home',
    loadComponent: () => import('./pages/home-page/home-page').then((m) => m.HomePage),
  },
];
