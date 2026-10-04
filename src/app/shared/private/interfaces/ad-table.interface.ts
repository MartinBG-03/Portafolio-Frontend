import { AdColumnFilterConfig } from './ad-filter.interface';

export type AdRowKey = string | number;
export type AdSortDirection = 'asc' | 'desc';

export interface AdTableColumn<T> {
  readonly key: string;
  readonly header: string;
  readonly align?: 'start' | 'end';
  readonly sortable?: boolean;
  readonly width?: string;
  readonly filter?: AdColumnFilterConfig;
  readonly value?: (row: T) => string | number | null | undefined;
}

export interface AdTableSort {
  readonly key: string;
  readonly direction: AdSortDirection;
}

export interface AdTableRowContext<T> {
  readonly $implicit: T;
  readonly index: number;
}

export interface AdTableChildren<T> {
  readonly rows: readonly T[];
  readonly page: number;
  readonly pageSize: number;
  readonly totalRecords: number;
  readonly search: string;
}

export interface AdTableChildrenRequest<T> {
  readonly parent: T;
  readonly page: number;
  readonly pageSize: number;
  readonly search: string;
}

export interface AdTableRowAction<T> {
  readonly row: T;
  readonly key: string;
  readonly parent: T | null;
}

export interface AdTableToolbarContext<T> {
  readonly $implicit: T | null;
  readonly depth: number;
}
