import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminShortcutService } from './core/services/admin-shortcut.service';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  constructor(adminShortcut: AdminShortcutService) {
    void adminShortcut;
  }
}
