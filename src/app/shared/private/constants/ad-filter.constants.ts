import { Localized } from '../../../core/public/i18n/language';
import {
  AdFilterMatchModeOption,
  AdFilterOperatorOption,
  AdFilterType,
} from '../interfaces/ad-filter.interface';

export const AD_FILTER_MAX_RULES = 10;

export const AD_FILTER_OPERATORS: Localized<
  Readonly<Record<AdFilterType, readonly AdFilterOperatorOption[]>>
> = {
  es: {
    text: [
      { value: 'contains', label: 'Contiene' },
      { value: 'notContains', label: 'No contiene' },
      { value: 'startsWith', label: 'Empieza con' },
      { value: 'endsWith', label: 'Termina con' },
      { value: 'equals', label: 'Es igual a' },
      { value: 'notEquals', label: 'Es distinto de' },
    ],
    number: [
      { value: 'equals', label: 'Igual a' },
      { value: 'notEquals', label: 'Distinto de' },
      { value: 'lessThan', label: 'Menor que' },
      { value: 'lessThanOrEqual', label: 'Menor o igual que' },
      { value: 'greaterThan', label: 'Mayor que' },
      { value: 'greaterThanOrEqual', label: 'Mayor o igual que' },
    ],
    date: [
      { value: 'dateIs', label: 'Es el día' },
      { value: 'dateIsNot', label: 'No es el día' },
      { value: 'dateBefore', label: 'Antes del' },
      { value: 'dateAfter', label: 'Después del' },
    ],
    option: [
      { value: 'equals', label: 'Es' },
      { value: 'notEquals', label: 'No es' },
    ],
  },
  en: {
    text: [
      { value: 'contains', label: 'Contains' },
      { value: 'notContains', label: 'Does not contain' },
      { value: 'startsWith', label: 'Starts with' },
      { value: 'endsWith', label: 'Ends with' },
      { value: 'equals', label: 'Equals' },
      { value: 'notEquals', label: 'Does not equal' },
    ],
    number: [
      { value: 'equals', label: 'Equal to' },
      { value: 'notEquals', label: 'Not equal to' },
      { value: 'lessThan', label: 'Less than' },
      { value: 'lessThanOrEqual', label: 'Less than or equal to' },
      { value: 'greaterThan', label: 'Greater than' },
      { value: 'greaterThanOrEqual', label: 'Greater than or equal to' },
    ],
    date: [
      { value: 'dateIs', label: 'Is on' },
      { value: 'dateIsNot', label: 'Is not on' },
      { value: 'dateBefore', label: 'Before' },
      { value: 'dateAfter', label: 'After' },
    ],
    option: [
      { value: 'equals', label: 'Is' },
      { value: 'notEquals', label: 'Is not' },
    ],
  },
};

export const AD_FILTER_MATCH_MODES: Localized<readonly AdFilterMatchModeOption[]> = {
  es: [
    { value: 'all', label: 'Cumplir todas las reglas' },
    { value: 'any', label: 'Cumplir alguna regla' },
  ],
  en: [
    { value: 'all', label: 'Match all rules' },
    { value: 'any', label: 'Match any rule' },
  ],
};

export const AD_FILTER_TEXTS: Localized<{
  readonly open: (column: string) => string;
  readonly panel: (column: string) => string;
  readonly matchMode: string;
  readonly operator: string;
  readonly value: string;
  readonly valuePlaceholder: string;
  readonly optionPlaceholder: string;
  readonly addRule: string;
  readonly removeRule: string;
  readonly clear: string;
  readonly apply: string;
  readonly clearAll: string;
}> = {
  es: {
    open: (column) => `Filtrar por ${column}`,
    panel: (column) => `Filtro de ${column}`,
    matchMode: 'Coincidencia',
    operator: 'Condición',
    value: 'Valor',
    valuePlaceholder: 'Escribe un valor',
    optionPlaceholder: 'Selecciona una opción',
    addRule: 'Agregar regla',
    removeRule: 'Quitar regla',
    clear: 'Limpiar',
    apply: 'Aplicar',
    clearAll: 'Limpiar filtros',
  },
  en: {
    open: (column) => `Filter by ${column}`,
    panel: (column) => `${column} filter`,
    matchMode: 'Match',
    operator: 'Condition',
    value: 'Value',
    valuePlaceholder: 'Type a value',
    optionPlaceholder: 'Select an option',
    addRule: 'Add rule',
    removeRule: 'Remove rule',
    clear: 'Clear',
    apply: 'Apply',
    clearAll: 'Clear filters',
  },
};
