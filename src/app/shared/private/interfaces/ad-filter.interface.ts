import { AdOption } from './ad-option.interface';

export type AdFilterType = 'text' | 'number' | 'date' | 'option';

export type AdFilterMatchMode = 'all' | 'any';

export type AdFilterOperator =
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'equals'
  | 'notEquals'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'dateIs'
  | 'dateIsNot'
  | 'dateBefore'
  | 'dateAfter';

export interface AdFilterRule {
  readonly operator: AdFilterOperator;
  readonly value: string;
}

export interface AdColumnFilterValue {
  readonly field: string;
  readonly matchMode: AdFilterMatchMode;
  readonly rules: readonly AdFilterRule[];
}

export interface AdColumnFilterConfig {
  readonly type: AdFilterType;
  readonly field?: string;
  readonly options?: readonly AdOption[];
}

export interface AdFilterOperatorOption extends AdOption {
  readonly value: AdFilterOperator;
}

export interface AdFilterMatchModeOption extends AdOption {
  readonly value: AdFilterMatchMode;
}
