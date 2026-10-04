import { AcademyDocument } from '../models/academy-document.model';

export const ACADEMY_DOCUMENTS: readonly AcademyDocument[] = [
  {
    id: 'first-app-guide',
    date: '2026-09-09',
    pages: 12,
    href: 'documents/first-app-guide.pdf',
    title: {
      es: 'Primeros pasos para armar tu primera app',
      en: 'First steps to build your first app',
    },
    description: {
      es: 'Una guía para pasar de la idea a una primera versión.',
      en: 'A guide to go from an idea to a first version.',
    },
  },
  {
    id: 'launch-checklist',
    date: '2026-08-18',
    pages: 4,
    href: 'documents/launch-checklist.pdf',
    title: {
      es: 'Checklist para lanzar un sitio web',
      en: 'Checklist to launch a website',
    },
    description: {
      es: 'Lo que conviene revisar antes de publicar.',
      en: 'What is worth reviewing before publishing.',
    },
  },
  {
    id: 'project-brief-template',
    date: '2026-07-25',
    pages: 2,
    href: 'documents/project-brief-template.pdf',
    title: {
      es: 'Plantilla de brief para tu proyecto',
      en: 'Brief template for your project',
    },
    description: {
      es: 'Ordena tus ideas antes de contármelas.',
      en: 'Organize your ideas before telling me about them.',
    },
  },
];
