import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminShortcutService {
  private handler: ((event: KeyboardEvent) => void) | null = null;

  constructor(private router: Router) {
    this.setupKeyboardListener();
  }

  private setupKeyboardListener(): void {
    this.handler = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        this.router.navigate(['/admin']);
      }
    };

    document.addEventListener('keydown', this.handler);
  }

  ngOnDestroy(): void {
    if (this.handler) {
      document.removeEventListener('keydown', this.handler);
    }
  }
}
