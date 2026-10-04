import { Routes } from '@angular/router';

export const contactRoutes: Routes = [
  {
    path: '',
    title: 'contact',
    loadComponent: () => import('./pages/contact-page/contact-page').then((m) => m.ContactPage),
  },
];
