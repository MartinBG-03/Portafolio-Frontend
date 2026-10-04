import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdLoadingService {
  private readonly active = signal(0);

  readonly loading = computed(() => this.active() > 0);

  start(): void {
    this.active.update((count) => count + 1);
  }

  stop(): void {
    this.active.update((count) => Math.max(0, count - 1));
  }
}
