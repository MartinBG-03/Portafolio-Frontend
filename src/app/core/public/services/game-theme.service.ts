import { DOCUMENT, effect, inject, Injectable, signal } from '@angular/core';

export type GameTheme = 'city' | 'forest' | 'construction';
export type GameArtStyle = '3d' | 'pixel';

const THEME_STORAGE_KEY = 'runner-theme';
const ART_STYLE_STORAGE_KEY = 'runner-art-style';
const ZOOM_STORAGE_KEY = 'runner-zoom';
export const GAME_ZOOM_LEVELS: readonly number[] = [1, 2, 3];
const THEMES: readonly GameTheme[] = ['city', 'forest', 'construction'];
export const GAME_ART_STYLES: readonly GameArtStyle[] = ['3d', 'pixel'];

@Injectable({ providedIn: 'root' })
export class GameThemeService {
  private readonly document = inject(DOCUMENT);

  readonly theme = signal<GameTheme>(this.readStored(THEME_STORAGE_KEY, THEMES, 'city'));
  readonly artStyle = signal<GameArtStyle>(this.readStored(ART_STYLE_STORAGE_KEY, GAME_ART_STYLES, '3d'));
  readonly zoom = signal<number | null>(this.readStoredZoom());

  constructor() {
    effect(() => this.store(THEME_STORAGE_KEY, this.theme()));
    effect(() => this.store(ART_STYLE_STORAGE_KEY, this.artStyle()));
  }

  setZoom(zoom: number): void {
    this.zoom.set(zoom);
    this.store(ZOOM_STORAGE_KEY, String(zoom));
  }

  private readStoredZoom(): number | null {
    try {
      const stored = Number(this.document.defaultView?.localStorage.getItem(ZOOM_STORAGE_KEY));
      return GAME_ZOOM_LEVELS.includes(stored) ? stored : null;
    } catch {
      return null;
    }
  }

  set(theme: GameTheme): void {
    this.theme.set(theme);
  }

  setArtStyle(style: GameArtStyle): void {
    this.artStyle.set(style);
  }

  private readStored<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
    try {
      const stored = this.document.defaultView?.localStorage.getItem(key);
      return (allowed as readonly string[]).includes(stored ?? '') ? (stored as T) : fallback;
    } catch {
      return fallback;
    }
  }

  private store(key: string, value: string): void {
    try {
      this.document.defaultView?.localStorage.setItem(key, value);
    } catch {
      return;
    }
  }
}
