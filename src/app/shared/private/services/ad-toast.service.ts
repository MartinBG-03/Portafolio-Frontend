import { Injectable, signal } from '@angular/core';
import { AD_TOAST_DURATION, AD_TOAST_ERROR_DURATION } from '../constants/ad-toast.constants';
import { AdToast, AdToastOptions } from '../interfaces/ad-toast.interface';

@Injectable({ providedIn: 'root' })
export class AdToastService {
  private readonly items = signal<readonly AdToast[]>([]);
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();
  private nextId = 1;

  readonly toasts = this.items.asReadonly();

  show({ tone, heading, message, duration }: AdToastOptions): number {
    const id = this.nextId++;
    const lifetime = duration ?? (tone === 'error' ? AD_TOAST_ERROR_DURATION : AD_TOAST_DURATION);

    this.items.update((items) => [...items, { id, tone, heading, message }]);
    if (lifetime > 0) {
      this.timers.set(
        id,
        setTimeout(() => this.dismiss(id), lifetime),
      );
    }
    return id;
  }

  success(heading: string, message: string): number {
    return this.show({ tone: 'success', heading, message });
  }

  error(heading: string, message: string): number {
    return this.show({ tone: 'error', heading, message });
  }

  warning(heading: string, message: string): number {
    return this.show({ tone: 'warning', heading, message });
  }

  info(heading: string, message: string): number {
    return this.show({ tone: 'info', heading, message });
  }

  dismiss(id: number): void {
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);
    this.items.update((items) => items.filter((item) => item.id !== id));
  }
}
