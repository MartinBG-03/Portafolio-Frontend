import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MediaPlaybackService {
  private readonly current = signal<symbol | null>(null);
  private nextId = 0;

  readonly active = this.current.asReadonly();

  register(): symbol {
    this.nextId += 1;
    return Symbol(`media-${this.nextId}`);
  }

  claim(id: symbol): void {
    this.current.set(id);
  }

  release(id: symbol): void {
    if (this.current() === id) {
      this.current.set(null);
    }
  }
}
