import { Routes } from '@angular/router';

export const academyRoutes: Routes = [
  {
    path: '',
    title: 'academy',
    loadComponent: () => import('./pages/academy-page/academy-page').then((m) => m.AcademyPage),
  },
];
