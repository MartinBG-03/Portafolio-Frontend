import { Routes } from '@angular/router';
import { authGuard } from './core/private/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./features/private/auth/auth.routes').then((m) => m.adAuthRoutes),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/layouts/private/ad-layout/ad-layout').then((m) => m.AdLayout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/private/dashboard/dashboard.routes').then((m) => m.adDashboardRoutes),
      },
      {
        path: 'site-administration',
        loadChildren: () =>
          import('./features/private/site-administration/site-administration.routes').then(
            (m) => m.adSiteAdministrationRoutes,
          ),
      },
      {
        path: 'system-configuration',
        loadChildren: () =>
          import('./features/private/system-configuration/system-configuration.routes').then(
            (m) => m.adSystemConfigurationRoutes,
          ),
      },
      {
        path: 'about-me',
        loadChildren: () =>
          import('./features/private/about-me/about-me.routes').then((m) => m.adAboutMeRoutes),
      },
      {
        path: 'projects',
        loadChildren: () =>
          import('./features/private/projects/projects.routes').then((m) => m.adProjectsRoutes),
      },
      {
        path: 'dev-log',
        loadChildren: () =>
          import('./features/private/dev-log/dev-log.routes').then((m) => m.adDevLogRoutes),
      },
      {
        path: 'dev-academy',
        loadChildren: () =>
          import('./features/private/dev-academy/dev-academy.routes').then(
            (m) => m.adDevAcademyRoutes,
          ),
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('./features/private/contact/contact.routes').then((m) => m.adContactRoutes),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./core/layouts/public/pb-layout/pb-layout').then((m) => m.PbLayout),
    children: [
      {
        path: '',
        loadChildren: () => import('./features/public/home/home.routes').then((m) => m.homeRoutes),
      },
      {
        path: 'projects',
        loadChildren: () =>
          import('./features/public/projects/projects.routes').then((m) => m.projectsRoutes),
      },
      {
        path: 'academy',
        loadChildren: () =>
          import('./features/public/academy/academy.routes').then((m) => m.academyRoutes),
      },
      {
        path: 'dev-log',
        loadChildren: () =>
          import('./features/public/dev-log/dev-log.routes').then((m) => m.devLogRoutes),
      },
      {
        path: 'design-system',
        loadChildren: () =>
          import('./features/public/design-system/design-system.routes').then(
            (m) => m.designSystemRoutes,
          ),
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('./features/public/contact/contact.routes').then((m) => m.contactRoutes),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
