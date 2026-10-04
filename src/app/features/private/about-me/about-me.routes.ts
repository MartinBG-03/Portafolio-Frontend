import { Routes } from '@angular/router';

export const adAboutMeRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'story' },
  {
    path: 'story',
    title: 'admin.story',
    loadComponent: () => import('./pages/story-page/story-page').then((m) => m.StoryPage),
  },
  {
    path: 'stack',
    title: 'admin.stack',
    loadComponent: () =>
      import('./pages/tech-stack-page/tech-stack-page').then((m) => m.TechStackPage),
  },
  {
    path: 'experience',
    title: 'admin.experience',
    loadComponent: () =>
      import('./pages/experience-page/experience-page').then((m) => m.ExperiencePage),
  },
  {
    path: 'resume',
    title: 'admin.resume',
    loadComponent: () => import('./pages/resume-page/resume-page').then((m) => m.ResumePage),
  },
];
