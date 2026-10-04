import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionExpiredService {
  readonly open = signal(false);

  show(): void {
    this.open.set(true);
  }

  dismiss(): void {
    this.open.set(false);
  }
}
