export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  readonly variant: ToastVariant;
  readonly title: string;
  readonly description?: string;
  readonly duration?: number;
}

export interface ToastMessage extends ToastOptions {
  readonly id: number;
}
