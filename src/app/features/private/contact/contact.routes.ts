import { Routes } from '@angular/router';

export const adContactRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'messages' },
  {
    path: 'messages',
    title: 'admin.messages',
    loadComponent: () =>
      import('./pages/messaging-page/messaging-page').then((m) => m.MessagingPage),
  },
];
