import { Localized } from '../../../core/public/i18n/language';

export const AD_COMMON_TEXTS: Localized<{
  readonly save: string;
  readonly cancel: string;
  readonly close: string;
  readonly confirm: string;
  readonly done: string;
  readonly optional: string;
  readonly select: string;
  readonly remove: string;
}> = {
  es: {
    save: 'Guardar',
    cancel: 'Cancelar',
    close: 'Cerrar',
    confirm: 'Confirmar',
    done: 'Listo',
    optional: '(Opcional)',
    select: 'Seleccionar',
    remove: 'Quitar',
  },
  en: {
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    confirm: 'Confirm',
    done: 'Done',
    optional: '(Optional)',
    select: 'Select',
    remove: 'Remove',
  },
};

export const AD_FIELD_TEXTS: Localized<{
  readonly searchPlaceholder: string;
  readonly clearSearch: string;
  readonly decrease: string;
  readonly increase: string;
  readonly noOptions: string;
  readonly breadcrumb: string;
  readonly dismissAlert: string;
  readonly showPassword: string;
  readonly hidePassword: string;
}> = {
  es: {
    searchPlaceholder: 'Buscar...',
    clearSearch: 'Limpiar búsqueda',
    decrease: 'Restar',
    increase: 'Sumar',
    noOptions: 'No hay opciones disponibles.',
    breadcrumb: 'Ruta',
    dismissAlert: 'Cerrar aviso',
    showPassword: 'Mostrar contraseña',
    hidePassword: 'Ocultar contraseña',
  },
  en: {
    searchPlaceholder: 'Search...',
    clearSearch: 'Clear search',
    decrease: 'Decrease',
    increase: 'Increase',
    noOptions: 'No options available.',
    breadcrumb: 'Path',
    dismissAlert: 'Dismiss alert',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
  },
};

export const AD_DATE_TEXTS: Localized<{
  readonly placeholder: string;
  readonly invalid: string;
  readonly choose: string;
  readonly previousMonth: string;
  readonly nextMonth: string;
  readonly today: string;
  readonly clear: string;
}> = {
  es: {
    placeholder: 'dd/mm/aaaa',
    invalid: 'Escribe una fecha válida (dd/mm/aaaa).',
    choose: 'Elegir fecha',
    previousMonth: 'Mes anterior',
    nextMonth: 'Mes siguiente',
    today: 'Hoy',
    clear: 'Limpiar',
  },
  en: {
    placeholder: 'dd/mm/yyyy',
    invalid: 'Enter a valid date (dd/mm/yyyy).',
    choose: 'Choose date',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    today: 'Today',
    clear: 'Clear',
  },
};

export const AD_PAGINATION_TEXTS: Localized<{
  readonly label: string;
  readonly perPage: string;
  readonly recordsPerPage: string;
  readonly first: string;
  readonly previous: string;
  readonly next: string;
  readonly last: string;
  readonly summary: (range: string, total: number) => string;
}> = {
  es: {
    label: 'Paginación',
    perPage: 'Por página',
    recordsPerPage: 'Registros por página',
    first: 'Primera página',
    previous: 'Página anterior',
    next: 'Página siguiente',
    last: 'Última página',
    summary: (range, total) =>
      `Mostrando ${range} de ${total} ${total === 1 ? 'registro' : 'registros'}`,
  },
  en: {
    label: 'Pagination',
    perPage: 'Per page',
    recordsPerPage: 'Records per page',
    first: 'First page',
    previous: 'Previous page',
    next: 'Next page',
    last: 'Last page',
    summary: (range, total) => `Showing ${range} of ${total} ${total === 1 ? 'record' : 'records'}`,
  },
};

export const AD_TABLE_TEXTS: Localized<{
  readonly empty: string;
  readonly searchPlaceholder: string;
  readonly rowActions: string;
  readonly actions: string;
  readonly expand: string;
  readonly expandRow: string;
  readonly collapseRow: string;
  readonly selectAll: string;
  readonly selectRow: string;
  readonly childCaption: string;
  readonly loading: string;
  readonly clearFilters: string;
  readonly configureColumns: string;
  readonly columnsHint: string;
  readonly resetOrder: string;
  readonly paginationOf: (caption: string) => string;
  readonly columnOrder: string;
  readonly moveUp: (column: string) => string;
  readonly moveDown: (column: string) => string;
}> = {
  es: {
    empty: 'No hay registros para mostrar.',
    searchPlaceholder: 'Buscar...',
    rowActions: 'Acciones de la fila',
    actions: 'Acciones',
    expand: 'Expandir',
    expandRow: 'Expandir fila',
    collapseRow: 'Contraer fila',
    selectAll: 'Seleccionar todos',
    selectRow: 'Seleccionar fila',
    childCaption: 'Registros hijos',
    loading: 'Cargando...',
    clearFilters: 'Limpiar filtros',
    configureColumns: 'Configurar columnas',
    columnsHint: 'Arrastra las columnas o usa los botones para cambiar su orden.',
    resetOrder: 'Restablecer orden',
    paginationOf: (caption) => `Paginación de ${caption.toLowerCase()}`,
    columnOrder: 'Orden de las columnas',
    moveUp: (column) => `Subir ${column}`,
    moveDown: (column) => `Bajar ${column}`,
  },
  en: {
    empty: 'There are no records to show.',
    searchPlaceholder: 'Search...',
    rowActions: 'Row actions',
    actions: 'Actions',
    expand: 'Expand',
    expandRow: 'Expand row',
    collapseRow: 'Collapse row',
    selectAll: 'Select all',
    selectRow: 'Select row',
    childCaption: 'Child records',
    loading: 'Loading...',
    clearFilters: 'Clear filters',
    configureColumns: 'Configure columns',
    columnsHint: 'Drag the columns or use the buttons to change their order.',
    resetOrder: 'Reset order',
    paginationOf: (caption) => `${caption} pagination`,
    columnOrder: 'Column order',
    moveUp: (column) => `Move ${column} up`,
    moveDown: (column) => `Move ${column} down`,
  },
};

export const AD_LANGUAGE_TEXTS: Localized<{ readonly label: string }> = {
  es: { label: 'Idioma' },
  en: { label: 'Language' },
};
