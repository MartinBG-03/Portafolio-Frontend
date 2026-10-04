import { afterNextRender, Component, DestroyRef, DOCUMENT, effect, ElementRef, inject, input, viewChild } from '@angular/core';
import { ThemeService } from '../../../../../../core/public/services/theme.service';
import {
  drawSprites,
  SpriteObstacle,
} from '../../../../../../core/layouts/public/components/pb-runner-game/theme-sprites';
import { RUNNER_CONFIG } from '../../../../../../core/layouts/public/components/pb-runner-game/runner-engine';
import { FooterGameTheme } from '../../../interfaces/footer/footer.interface';

const SCENE_HEIGHT = 60;
const GROUND_Y = 52;
const PREVIEW_CYCLE = 0.15;

@Component({
  selector: 'ad-game-theme-preview',
  templateUrl: './game-theme-preview.html',
  styleUrl: './game-theme-preview.scss',
})
export class GameThemePreview {
  readonly theme = input.required<FooterGameTheme>();

  private readonly document = inject(DOCUMENT);
  private readonly themeService = inject(ThemeService);

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly baselineInk = viewChild.required<ElementRef<HTMLElement>>('baselineInk');

  private context: CanvasRenderingContext2D | null = null;
  private baseline: string | null = null;
  private width = 0;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const canvas = this.canvas().nativeElement;
      this.context = canvas.getContext('2d');
      const observer = new ResizeObserver(() => this.resize());
      observer.observe(canvas);
      this.resize();
      destroyRef.onDestroy(() => observer.disconnect());
    });

    effect(() => {
      this.themeService.theme();
      this.theme();
      this.baseline = null;
      requestAnimationFrame(() => this.draw());
    });
  }

  private resize(): void {
    const context = this.context;
    if (!context) {
      return;
    }
    const canvas = this.canvas().nativeElement;
    const ratio = this.document.defaultView?.devicePixelRatio ?? 1;
    const zoom = canvas.clientHeight / SCENE_HEIGHT;
    this.width = canvas.clientWidth / zoom;
    canvas.width = Math.round(canvas.clientWidth * ratio);
    canvas.height = Math.round(canvas.clientHeight * ratio);
    context.setTransform(ratio * zoom, 0, 0, ratio * zoom, 0, 0);
    this.draw();
  }

  private draw(): void {
    const context = this.context;
    if (!context || this.width === 0) {
      return;
    }
    this.baseline ??= this.readBaseline();
    if (!this.baseline) {
      return;
    }

    context.clearRect(0, 0, this.width, SCENE_HEIGHT);

    context.strokeStyle = this.baseline;
    context.lineWidth = 2;
    context.setLineDash([10, 8]);
    context.beginPath();
    context.moveTo(0, GROUND_Y + 1);
    context.lineTo(this.width, GROUND_Y + 1);
    context.stroke();
    context.setLineDash([]);

    const { playerSize, airGap, airThickness, hangingWidth } = RUNNER_CONFIG;
    const airX = this.width * 0.75;
    const airObstacle: SpriteObstacle =
      this.theme() === 'construction'
        ? { x: airX, y: 0, width: hangingWidth, height: GROUND_Y - airGap, kind: 'hanging' }
        : { x: airX, y: GROUND_Y - airGap - airThickness, width: 32, height: airThickness, kind: 'air' };

    drawSprites(context, {
      theme: this.theme(),
      style: '3d',
      cycle: PREVIEW_CYCLE,
      player: { x: 12, y: GROUND_Y - playerSize, width: playerSize, height: playerSize, pose: 'run' },
      obstacles: [{ x: this.width * 0.42, y: GROUND_Y - 30, width: 18, height: 30, kind: 'ground' }, airObstacle],
    });
  }

  private readBaseline(): string | null {
    const view = this.document.defaultView;
    return view ? view.getComputedStyle(this.baselineInk().nativeElement).color : null;
  }
}
