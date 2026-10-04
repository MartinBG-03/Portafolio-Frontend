import { Routes } from '@angular/router';

export const adDashboardRoutes: Routes = [
  {
    path: '',
    title: 'admin.dashboard',
    loadComponent: () =>
      import('./pages/dashboard-page/dashboard-page').then((m) => m.DashboardPage),
  },
];
