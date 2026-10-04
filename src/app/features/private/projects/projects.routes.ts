import { Routes } from '@angular/router';

export const adProjectsRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'management' },
  {
    path: 'management',
    title: 'admin.projectManagement',
    loadComponent: () =>
      import('./pages/project-management-page/project-management-page').then(
        (m) => m.ProjectManagementPage,
      ),
  },
];
