import { Routes } from '@angular/router';

export const adAuthRoutes: Routes = [
  {
    path: '',
    title: 'admin.login',
    loadComponent: () => import('./pages/ad-login/ad-login').then((m) => m.AdLogin),
  },
];
