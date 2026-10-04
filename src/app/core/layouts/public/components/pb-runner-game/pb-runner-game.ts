import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { LanguageService } from '../../../../public/services/language.service';
import { ThemeService } from '../../../../public/services/theme.service';
import {
  GAME_ART_STYLES,
  GAME_ZOOM_LEVELS,
  GameArtStyle,
  GameTheme,
  GameThemeService,
} from '../../../../public/services/game-theme.service';
import { SiteFooterService } from '../../../../public/services/site-footer.service';
import {
  createRunner,
  groundY,
  jump,
  RUNNER_CONFIG,
  RunnerState,
  RunnerStatus,
  score,
  setDucking,
  startRunner,
  step,
} from './runner-engine';
import { drawSprites, PlayerPose } from './theme-sprites';

const BEST_KEY = 'runner-best';
const STRIDE_PX = 150;
const WIDE_SCREEN_MIN_WIDTH = 720;
const RESTART_DELAY = 400;
const JUMP_KEYS = new Set([' ', 'Spacebar', 'ArrowUp', 'w', 'W']);
const DUCK_KEYS = new Set(['ArrowDown', 's', 'S']);

@Component({
  selector: 'pb-runner-game',
  templateUrl: './pb-runner-game.html',
  styleUrl: './pb-runner-game.scss',
})
export class PbRunnerGame {
  private readonly document = inject(DOCUMENT);
  private readonly theme = inject(ThemeService).theme;
  private readonly gameThemeService = inject(GameThemeService);
  private readonly languageService = inject(LanguageService);
  private readonly footer = inject(SiteFooterService).data;

  protected readonly t = this.languageService.t;
  protected readonly height = RUNNER_CONFIG.height;
  protected readonly status = signal<RunnerStatus>('idle');
  protected readonly score = signal(0);
  protected readonly best = signal(this.readBest());
  protected readonly gameTheme = this.gameThemeService.theme;
  protected readonly artStyle = this.gameThemeService.artStyle;
  protected readonly artStyles = GAME_ART_STYLES;
  protected readonly minZoom = GAME_ZOOM_LEVELS[0];
  protected readonly maxZoom = GAME_ZOOM_LEVELS[GAME_ZOOM_LEVELS.length - 1];
  private readonly autoZoom = signal(1);
  protected readonly zoom = computed(() => this.gameThemeService.zoom() ?? this.autoZoom());
  protected readonly themes = computed(() => this.footer().game.themes.map((theme) => theme.theme));

  private readonly activeThemeContent = computed(() =>
    this.footer().game.themes.find((candidate) => candidate.theme === this.gameTheme()),
  );

  protected readonly instructions = computed(() => {
    const content = this.activeThemeContent();
    if (!content) {
      return this.t().runner.start;
    }
    return this.languageService.language() === 'en' ? content.instructionsEn : content.instructionsEs;
  });

  protected readonly gameOverText = computed(() => {
    const content = this.activeThemeContent();
    if (!content) {
      return this.t().runner.over;
    }
    return this.languageService.language() === 'en' ? content.gameOverEn : content.gameOverEs;
  });

  protected readonly retryText = computed(() => {
    const content = this.activeThemeContent();
    if (!content) {
      return this.t().runner.retry;
    }
    return this.languageService.language() === 'en' ? content.retryEn : content.retryEs;
  });

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly baselineInk = viewChild.required<ElementRef<HTMLElement>>('baselineInk');

  private state: RunnerState = createRunner();
  private ducking = false;
  private width = 0;
  private context: CanvasRenderingContext2D | null = null;
  private baseline: string | null = null;
  private frame = 0;
  private lastTime = 0;
  private overAt = 0;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const canvas = this.canvas().nativeElement;
      this.context = canvas.getContext('2d');
      const observer = new ResizeObserver(() => this.resize());
      observer.observe(canvas);
      this.resize();

      destroyRef.onDestroy(() => {
        observer.disconnect();
        cancelAnimationFrame(this.frame);
      });
    });

    effect(() => {
      this.theme();
      this.gameTheme();
      this.artStyle();
      this.baseline = null;
      requestAnimationFrame(() => this.draw());
    });

    effect(() => {
      this.zoom();
      requestAnimationFrame(() => this.resize());
    });
  }

  protected changeZoom(direction: 1 | -1): void {
    const index = GAME_ZOOM_LEVELS.indexOf(this.zoom()) + direction;
    const next = GAME_ZOOM_LEVELS[Math.max(0, Math.min(GAME_ZOOM_LEVELS.length - 1, index))];
    this.gameThemeService.setZoom(next);
  }

  protected setTheme(theme: GameTheme): void {
    this.gameThemeService.set(theme);
  }

  protected setArtStyle(style: GameArtStyle): void {
    this.gameThemeService.setArtStyle(style);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (DUCK_KEYS.has(event.key)) {
      event.preventDefault();
      this.ducking = true;
      return;
    }
    if (!JUMP_KEYS.has(event.key)) {
      return;
    }
    event.preventDefault();
    if (!event.repeat) {
      this.act();
    }
  }

  protected onKeyup(event: KeyboardEvent): void {
    if (DUCK_KEYS.has(event.key)) {
      this.ducking = false;
    }
  }

  protected onPointerdown(event: PointerEvent): void {
    event.preventDefault();
    this.canvas().nativeElement.focus();
    this.act();
  }

  private act(): void {
    if (this.state.status === 'running') {
      this.state = jump(this.state);
      return;
    }
    if (this.state.status === 'over' && performance.now() - this.overAt < RESTART_DELAY) {
      return;
    }
    this.state = jump(startRunner());
    this.status.set('running');
    this.score.set(0);
    this.lastTime = performance.now();
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame((time) => this.tick(time));
  }

  private tick(time: number): void {
    this.state = setDucking(this.state, this.ducking);
    this.state = step(
      this.state,
      (time - this.lastTime) / 1000,
      this.width,
      this.gameTheme() === 'construction',
    );
    this.lastTime = time;

    const current = score(this.state);
    if (current !== this.score()) {
      this.score.set(current);
    }
    this.draw();

    if (this.state.status === 'over') {
      this.finish(current);
      return;
    }
    this.frame = requestAnimationFrame((next) => this.tick(next));
  }

  private finish(finalScore: number): void {
    this.overAt = performance.now();
    this.status.set('over');
    if (finalScore > this.best()) {
      this.best.set(finalScore);
      this.storeBest(finalScore);
    }
  }

  private resize(): void {
    if (!this.context) {
      return;
    }
    const canvas = this.canvas().nativeElement;
    const ratio = this.document.defaultView?.devicePixelRatio ?? 1;
    const cssWidth = canvas.clientWidth;
    this.autoZoom.set(cssWidth >= WIDE_SCREEN_MIN_WIDTH ? 2 : 1);
    const zoom = this.zoom();
    this.width = cssWidth / zoom;
    canvas.width = Math.round(cssWidth * ratio);
    canvas.height = Math.round(this.height * zoom * ratio);
    this.context?.setTransform(ratio * zoom, 0, 0, ratio * zoom, 0, 0);
    this.draw();
  }

  private readBaseline(): string | null {
    const view = this.document.defaultView;
    return view ? view.getComputedStyle(this.baselineInk().nativeElement).color : null;
  }

  private draw(): void {
    const context = this.context;
    if (!context) {
      return;
    }
    this.baseline ??= this.readBaseline();
    if (!this.baseline) {
      return;
    }

    const ground = groundY();
    const { playerX, playerSize, duckSize } = RUNNER_CONFIG;
    context.clearRect(0, 0, this.width, this.height);

    context.strokeStyle = this.baseline;
    context.lineWidth = 2;
    context.setLineDash([10, 8]);
    context.lineDashOffset = this.state.distance % 18;
    context.beginPath();
    context.moveTo(0, ground + 1);
    context.lineTo(this.width, ground + 1);
    context.stroke();
    context.setLineDash([]);

    const height = this.state.isDucking ? duckSize : playerSize;
    const top = ground - height - this.state.playerY;

    drawSprites(context, {
      theme: this.gameTheme(),
      style: this.artStyle(),
      cycle: this.state.distance / STRIDE_PX,
      player: { x: playerX, y: top, width: playerSize, height, pose: this.pose() },
      obstacles: this.state.obstacles.map((obstacle) => ({
        x: obstacle.x,
        y: ground - obstacle.bottom - obstacle.height,
        width: obstacle.width,
        height: obstacle.height,
        kind: obstacle.kind,
      })),
    });
  }

  private pose(): PlayerPose {
    if (this.state.isDucking) {
      return 'duck';
    }
    return this.state.playerY > 0 ? 'jump' : 'run';
  }

  private readBest(): number {
    try {
      const stored = Number(this.document.defaultView?.localStorage.getItem(BEST_KEY));
      return Number.isFinite(stored) && stored > 0 ? Math.floor(stored) : 0;
    } catch {
      return 0;
    }
  }

  private storeBest(value: number): void {
    try {
      this.document.defaultView?.localStorage.setItem(BEST_KEY, String(value));
    } catch {
      return;
    }
  }
}
