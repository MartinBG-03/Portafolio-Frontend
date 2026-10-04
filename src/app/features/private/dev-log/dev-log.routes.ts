import { Routes } from '@angular/router';
import { unsavedChangesGuard } from '../../../core/private/guards/unsaved-changes.guard';

export const adDevLogRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'posts' },
  {
    path: 'posts',
    title: 'admin.posts',
    loadComponent: () =>
      import('./pages/post-management-page/post-management-page').then((m) => m.PostManagementPage),
  },
  {
    path: 'posts/new',
    title: 'admin.posts',
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () => import('./pages/post-form-page/post-form-page').then((m) => m.PostFormPage),
  },
  {
    path: 'posts/:id/edit',
    title: 'admin.posts',
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () => import('./pages/post-form-page/post-form-page').then((m) => m.PostFormPage),
  },
];
