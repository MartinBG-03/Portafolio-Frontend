import { Routes } from '@angular/router';

export const adDevAcademyRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'books' },
  {
    path: 'books',
    title: 'admin.books',
    loadComponent: () =>
      import('./pages/book-management-page/book-management-page').then((m) => m.BookManagementPage),
  },
  {
    path: 'evaluations',
    title: 'admin.evaluations',
    loadComponent: () =>
      import('./pages/exam-management-page/exam-management-page').then((m) => m.ExamManagementPage),
  },
];
