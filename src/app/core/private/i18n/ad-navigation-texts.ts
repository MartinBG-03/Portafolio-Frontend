import { Localized } from '../../public/i18n/language';

export type AdNavKey =
  | 'login'
  | 'dashboard'
  | 'siteAdministration'
  | 'navigation'
  | 'footer'
  | 'home'
  | 'systemConfiguration'
  | 'catalogs'
  | 'aboutMe'
  | 'story'
  | 'stack'
  | 'experience'
  | 'resume'
  | 'projects'
  | 'projectManagement'
  | 'devLog'
  | 'posts'
  | 'devAcademy'
  | 'books'
  | 'evaluations'
  | 'contact'
  | 'messages';

export interface AdNavigationTexts {
  readonly nav: Readonly<Record<AdNavKey, string>>;
  readonly descriptions: Readonly<Partial<Record<AdNavKey, string>>>;
  readonly navbar: {
    readonly brandAlt: (siteName: string) => string;
    readonly navLabel: string;
    readonly showAllModules: string;
    readonly viewSite: string;
    readonly profileRole: string;
    readonly logout: string;
  };
}

export const AD_ROUTE_TITLE_PREFIX = 'admin.';

export const AD_NAVIGATION_TEXTS: Localized<AdNavigationTexts> = {
  es: {
    nav: {
      login: 'Iniciar sesión',
      dashboard: 'Dashboard',
      siteAdministration: 'Administración del sitio',
      navigation: 'Navegación',
      footer: 'Pie de página',
      home: 'Inicio',
      systemConfiguration: 'Configuraciones del sistema',
      catalogs: 'Catálogos',
      aboutMe: 'Sobre mí',
      story: 'Historia',
      stack: 'Stack tecnológico',
      experience: 'Experiencia obtenida',
      resume: 'Hoja de vida',
      projects: 'Proyectos',
      projectManagement: 'Gestión de proyectos',
      devLog: 'DevLog',
      posts: 'Gestión de publicaciones',
      devAcademy: 'DevAcademy',
      books: 'Gestión de libros',
      evaluations: 'Gestión de evaluaciones',
      contact: 'Contacto',
      messages: 'Mensajería',
    },
    descriptions: {
      dashboard: 'Aquí irá el resumen del panel de administración.',
      navigation: 'Administra el menú de navegación del sitio público.',
      footer: 'Administra el contenido del pie de página del sitio público.',
      home: 'Administra el contenido de la página de inicio.',
      catalogs: 'Administra los catálogos que alimentan el sistema.',
      story: 'Administra la historia que se muestra en «Sobre mí».',
      stack: 'Administra las tecnologías que conforman tu stack.',
      experience: 'Administra la experiencia profesional obtenida.',
      resume: 'Administra la hoja de vida disponible para descarga.',
      projectManagement: 'Crea, edita y publica los proyectos del portafolio.',
      posts: 'Crea, edita y publica las entradas del DevLog.',
      books: 'Administra los libros disponibles en DevAcademy.',
      evaluations: 'Administra las evaluaciones de DevAcademy.',
      messages: 'Consulta los mensajes recibidos desde el formulario de contacto.',
    },
    navbar: {
      brandAlt: (siteName) => `Panel de administración de ${siteName}`,
      navLabel: 'Administración',
      showAllModules: 'Ver todos los módulos',
      viewSite: 'Ir al sitio público',
      profileRole: 'Administrador del Sistema',
      logout: 'Cerrar sesión',
    },
  },
  en: {
    nav: {
      login: 'Log in',
      dashboard: 'Dashboard',
      siteAdministration: 'Site administration',
      navigation: 'Navigation',
      footer: 'Footer',
      home: 'Home',
      systemConfiguration: 'System settings',
      catalogs: 'Catalogs',
      aboutMe: 'About me',
      story: 'Story',
      stack: 'Tech stack',
      experience: 'Experience',
      resume: 'Résumé',
      projects: 'Projects',
      projectManagement: 'Project management',
      devLog: 'DevLog',
      posts: 'Post management',
      devAcademy: 'DevAcademy',
      books: 'Book management',
      evaluations: 'Assessment management',
      contact: 'Contact',
      messages: 'Messaging',
    },
    descriptions: {
      dashboard: 'The admin panel summary will go here.',
      navigation: 'Manage the navigation menu of the public site.',
      footer: 'Manage the footer content of the public site.',
      home: 'Manage the content of the home page.',
      catalogs: 'Manage the catalogs that feed the system.',
      story: 'Manage the story shown in "About me".',
      stack: 'Manage the technologies that make up your stack.',
      experience: 'Manage the professional experience you have gained.',
      resume: 'Manage the résumé available for download.',
      projectManagement: 'Create, edit and publish the portfolio projects.',
      posts: 'Create, edit and publish the DevLog entries.',
      books: 'Manage the books available in DevAcademy.',
      evaluations: 'Manage the DevAcademy assessments.',
      messages: 'Review the messages received through the contact form.',
    },
    navbar: {
      brandAlt: (siteName) => `${siteName} admin panel`,
      navLabel: 'Administration',
      showAllModules: 'Show all modules',
      viewSite: 'Go to public site',
      profileRole: 'System Administrator',
      logout: 'Log out',
    },
  },
};
