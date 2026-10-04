import { Project } from '../models/project.model';

export const PROJECTS: readonly Project[] = [
  {
    id: 'ecommerce-bolivar',
    category: 'web',
    date: '2026-09-18',
    title: { es: 'E-commerce Bolívar', en: 'Bolívar e-commerce' },
    description: {
      es: 'Tienda online con pasarela de pagos integrada.',
      en: 'Online store with an integrated payment gateway.',
    },
  },
  {
    id: 'booking-app',
    category: 'mobile',
    date: '2026-08-22',
    title: { es: 'App de reservas', en: 'Booking app' },
    description: {
      es: 'Reservas en tiempo real para restaurantes.',
      en: 'Real-time reservations for restaurants.',
    },
  },
  {
    id: 'invoicing-bot',
    category: 'automation',
    date: '2026-07-30',
    title: { es: 'Bot de facturación', en: 'Invoicing bot' },
    description: {
      es: 'Generación automática de comprobantes.',
      en: 'Automatic generation of receipts.',
    },
  },
];
