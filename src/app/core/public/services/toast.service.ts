import { Injectable, signal } from '@angular/core';
import { ToastMessage, ToastOptions } from '../../../shared/public/interfaces/toast.interface';

const DEFAULT_DURATION_MS = 5000;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly messages = signal<readonly ToastMessage[]>([]);
  private nextId = 0;

  readonly toasts = this.messages.asReadonly();

  show(options: ToastOptions): number {
    const id = this.nextId++;
    const duration = options.duration ?? DEFAULT_DURATION_MS;

    this.messages.update((messages) => [...messages, { ...options, id }]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }

    return id;
  }

  dismiss(id: number): void {
    this.messages.update((messages) => messages.filter((message) => message.id !== id));
  }
}
