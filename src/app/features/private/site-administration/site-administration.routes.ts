import { Routes } from '@angular/router';

export const adSiteAdministrationRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'navigation' },
  {
    path: 'navigation',
    title: 'admin.navigation',
    loadComponent: () =>
      import('./pages/site-navigation-page/site-navigation-page').then((m) => m.SiteNavigationPage),
  },
  {
    path: 'footer',
    title: 'admin.footer',
    loadComponent: () =>
      import('./pages/site-footer-page/site-footer-page').then((m) => m.SiteFooterPage),
  },
  {
    path: 'home',
    title: 'admin.home',
    loadComponent: () =>
      import('./pages/site-home-page/site-home-page').then((m) => m.SiteHomePage),
  },
];
