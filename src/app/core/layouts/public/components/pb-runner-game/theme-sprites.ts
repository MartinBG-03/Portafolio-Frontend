import { GameArtStyle, GameTheme } from '../../../../public/services/game-theme.service';
import { RunnerObstacleKind } from './runner-engine';

export type PlayerPose = 'run' | 'duck' | 'jump';

export interface SpriteBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SpritePlayer extends SpriteBox {
  pose: PlayerPose;
}

export interface SpriteObstacle extends SpriteBox {
  kind: RunnerObstacleKind;
}

export interface SpriteScene {
  theme: GameTheme;
  style: GameArtStyle;
  cycle: number;
  player: SpritePlayer;
  obstacles: SpriteObstacle[];
}

type Context2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
type Point = readonly [number, number];

const COLORS = {
  skin: '#d39a6a',
  hair: '#2b1d14',
  eye: '#1a1a1a',
  eyeGlow: '#f2c14e',
  runShirt: '#d64533',
  runShorts: '#23324a',
  shoe: '#f1f1f1',
  band: '#f2c14e',
  expHat: '#b08a4a',
  expBand: '#6a4a2c',
  expShirt: '#6b7d3a',
  expPants: '#7a5a3a',
  expPack: '#8a5a3a',
  boot: '#3a2a1e',
  wkHelmet: '#f2c14e',
  wkShirt: '#8d949c',
  wkVest: '#ff7a00',
  wkStripe: '#e9edf0',
  wkPants: '#3b5a80',
  metal: '#b9bfc6',
  metalDark: '#7d848c',
  bar: '#f4f4f4',
  barStripe: '#d64533',
  bird: '#9aa0aa',
  birdDark: '#6b717c',
  birdWing: '#b7bcc5',
  neck: '#5f8a78',
  beak: '#e3a24a',
  bark: '#7a5230',
  barkDark: '#553820',
  wood: '#d6b47a',
  rings: '#a98250',
  bat: '#3d3440',
  batWing: '#5c4b63',
  cone: '#ff7a00',
  coneStripe: '#f4f4f4',
  coneBase: '#2a2a2a',
  board: '#ff7a00',
  boardStripe: '#f4f4f4',
  steel: '#5a5f66',
  steelLight: '#a5acb4',
  chain: '#7d838a',
} as const;

type Part = keyof typeof COLORS;

const FAR_SHADE = 0.25;
const PIXEL_ALPHA_THRESHOLD = 110;
const PIXEL_FRAMES_PER_CYCLE = 8;

function toRgb(hex: string): [number, number, number] {
  return [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16)) as [number, number, number];
}

function darken(hex: string, amount: number): string {
  return (
    '#' +
    toRgb(hex)
      .map((channel) => Math.round(channel * (1 - amount)).toString(16).padStart(2, '0'))
      .join('')
  );
}

const FAR_COLORS = Object.fromEntries(
  Object.entries(COLORS).map(([part, hex]) => [part, darken(hex, FAR_SHADE)]),
) as Record<Part, string>;

const PIXEL_PALETTE = [...Object.values(COLORS), ...Object.values(FAR_COLORS)].map(toRgb);

interface Painter {
  readonly context: Context2D;
  shape(build: (context: Context2D) => void, part: Part, far?: boolean): void;
  limb(from: Point, to: Point, width: number, part: Part, far?: boolean): void;
  ring(cx: number, cy: number, rx: number, ry: number, part: Part, width?: number): void;
  dot(x: number, y: number, radius: number, part: Part, far?: boolean): void;
}

function createPainter(context: Context2D): Painter {
  const color = (part: Part, far = false): string => (far ? FAR_COLORS[part] : COLORS[part]);
  return {
    context,
    shape(build, part, far) {
      context.beginPath();
      build(context);
      context.fillStyle = color(part, far);
      context.fill();
    },
    limb(from, to, width, part, far) {
      context.lineCap = 'round';
      context.strokeStyle = color(part, far);
      context.lineWidth = width;
      context.beginPath();
      context.moveTo(from[0], from[1]);
      context.lineTo(to[0], to[1]);
      context.stroke();
    },
    ring(cx, cy, rx, ry, part, width = 0.8) {
      context.beginPath();
      context.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      context.lineWidth = width;
      context.strokeStyle = color(part);
      context.stroke();
    },
    dot(x, y, radius, part, far) {
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fillStyle = color(part, far);
      context.fill();
    },
  };
}

const along = (point: Point, length: number, angle: number): Point => [
  point[0] + length * Math.sin(angle),
  point[1] + length * Math.cos(angle),
];

const lerp = (from: Point, to: Point, t: number): Point => [
  from[0] + (to[0] - from[0]) * t,
  from[1] + (to[1] - from[1]) * t,
];

interface Leg {
  hip: Point;
  knee: Point;
  foot: Point;
  toe: Point;
}

interface Arm {
  shoulder: Point;
  elbow: Point;
  hand: Point;
}

interface Pose {
  head: { x: number; y: number; r: number };
  shoulder: Point;
  hip: Point;
  legs: [Leg, Leg];
  arms: [Arm, Arm];
  bodyWidth: number;
  scale: number;
}

function leg(hip: Point, thigh: number, shin: number, toe: number, angle: number, bend: number): Leg {
  const knee = along(hip, thigh, angle);
  const shinAngle = angle - bend;
  const foot = along(knee, shin, shinAngle);
  return {
    hip,
    knee,
    foot,
    toe: [foot[0] + toe * Math.cos(shinAngle), foot[1] - toe * Math.sin(shinAngle)],
  };
}

function arm(shoulder: Point, upper: number, fore: number, upperAngle: number, foreAngle: number): Arm {
  const elbow = along(shoulder, upper, upperAngle);
  return { shoulder, elbow, hand: along(elbow, fore, foreAngle) };
}

const POSE_SIZE = { width: 28, run: 28, jump: 28, duck: 14 } as const;

function computePose(pose: PlayerPose, cycle: number): Pose {
  if (pose === 'duck') {
    const phase = cycle * Math.PI * 2 * 1.25;
    const shoulder: Point = [18.6, 6.4];
    const hip: Point = [10.2, 6.8];
    const sides = [0, 1].map((side) => phase + side * Math.PI);
    const upper = sides.map((f) => 1.2 + 0.35 * Math.sin(f + Math.PI));
    return {
      head: { x: 22.6, y: 4.9, r: 3.1 },
      shoulder,
      hip,
      legs: [
        leg(hip, 4.6, 4.3, 2, 0.95 + 0.55 * Math.sin(sides[0]), 1.5 + 0.45 * Math.cos(sides[0])),
        leg(hip, 4.6, 4.3, 2, 0.95 + 0.55 * Math.sin(sides[1]), 1.5 + 0.45 * Math.cos(sides[1])),
      ],
      arms: [
        arm(shoulder, 3.8, 3.6, upper[0], upper[0] + 0.35),
        arm(shoulder, 3.8, 3.6, upper[1], upper[1] + 0.35),
      ],
      bodyWidth: 5.4,
      scale: 0.9,
    };
  }

  if (pose === 'jump') {
    const flutter = 0.05 * Math.sin(cycle * Math.PI * 2 * 0.6);
    const shoulder: Point = [15.2, 10];
    const hip: Point = [12.6, 15.4];
    return {
      head: { x: 17, y: 5.4, r: 3.4 },
      shoulder,
      hip,
      legs: [leg(hip, 5.8, 5.6, 2.3, 1.35 + flutter, 2.35), leg(hip, 5.8, 5.6, 2.3, 0.9 - flutter, 2)],
      arms: [
        arm(shoulder, 4.4, 4, 2.5 + flutter, 2.7 + flutter),
        arm(shoulder, 4.4, 4, 2.1 - flutter, 2.3 - flutter),
      ],
      bodyWidth: 6.2,
      scale: 1,
    };
  }

  const phase = cycle * Math.PI * 2;
  const bob = Math.abs(Math.cos(phase));
  const shoulder: Point = [15, 10.2 + bob];
  const hip: Point = [12.6, 16 + bob];
  const sides = [phase, phase + Math.PI];
  const runLeg = (f: number): Leg => leg(hip, 5.8, 5.6, 2.3, 0.75 * Math.sin(f), 0.15 + 1.15 * (0.5 + 0.5 * Math.cos(f)));
  const runArm = (f: number): Arm => {
    const upper = -0.85 * Math.sin(f);
    return arm(shoulder, 4.4, 4, upper, upper + 1.55);
  };
  return {
    head: { x: 17, y: 5.6 + bob, r: 3.4 },
    shoulder,
    hip,
    legs: [runLeg(sides[0]), runLeg(sides[1])],
    arms: [runArm(sides[0]), runArm(sides[1])],
    bodyWidth: 6.2,
    scale: 1,
  };
}

type Character = 'runner' | 'explorer' | 'worker';

interface Outfit {
  torso: Part;
  upper: Part;
  fore: Part;
  thigh: Part;
  shin: Part;
  shoe: Part;
  sleeve?: Part;
  shorts?: Part;
  pack?: boolean;
  stripe?: boolean;
}

const OUTFITS: Record<Character, Outfit> = {
  runner: {
    torso: 'runShirt',
    sleeve: 'runShirt',
    upper: 'skin',
    fore: 'skin',
    thigh: 'skin',
    shin: 'skin',
    shorts: 'runShorts',
    shoe: 'shoe',
  },
  explorer: {
    torso: 'expShirt',
    upper: 'expShirt',
    fore: 'expShirt',
    thigh: 'expPants',
    shin: 'expPants',
    shoe: 'boot',
    pack: true,
  },
  worker: {
    torso: 'wkVest',
    upper: 'wkShirt',
    fore: 'wkShirt',
    thigh: 'wkPants',
    shin: 'wkPants',
    shoe: 'boot',
    stripe: true,
  },
};

function drawHead(painter: Painter, character: Character, head: Pose['head']): void {
  const { x, y, r } = head;
  painter.shape((c) => c.arc(x, y, r, 0, Math.PI * 2), 'skin');
  if (character === 'runner') {
    painter.shape((c) => {
      c.arc(x, y, r + 0.25, Math.PI * 0.95, Math.PI * 1.95);
      c.lineTo(x - r * 0.2, y - r * 0.15);
      c.closePath();
    }, 'hair');
    painter.limb([x - r * 0.95, y - r * 0.42], [x + r * 0.8, y - r * 0.62], 1.1, 'band');
  } else if (character === 'explorer') {
    painter.shape((c) => c.ellipse(x + 0.5, y - r * 0.5, r * 1.75, 1.05, 0, 0, Math.PI * 2), 'expHat');
    painter.shape((c) => c.roundRect(x - r * 0.85, y - r * 1.32, r * 1.7, r * 0.88, [1.2, 1.2, 0, 0]), 'expHat');
    painter.shape((c) => c.rect(x - r * 0.85, y - r * 0.66, r * 1.7, 0.75), 'expBand');
  } else {
    painter.shape((c) => {
      c.arc(x, y - r * 0.12, r * 1.12, Math.PI, 0);
      c.closePath();
    }, 'wkHelmet');
    painter.limb([x - r * 1.05, y - r * 0.12], [x + r * 1.65, y - r * 0.12], 1.1, 'wkHelmet');
  }
  painter.dot(x + r * 0.5, y + r * 0.05, 0.6, 'eye');
}

function drawCharacter(
  painter: Painter,
  character: Character,
  pose: PlayerPose,
  cycle: number,
  width: number,
  height: number,
): void {
  painter.context.scale(width / POSE_SIZE.width, height / POSE_SIZE[pose]);
  const outfit = OUTFITS[character];
  const body = computePose(pose, cycle);
  const scale = body.scale;
  const dx = body.hip[0] - body.shoulder[0];
  const dy = body.hip[1] - body.shoulder[1];
  const length = Math.hypot(dx, dy);
  const back: Point = [-dy / length, dx / length];

  const drawLeg = (limb: Leg, far: boolean): void => {
    painter.limb(limb.hip, limb.knee, 3.4 * scale, outfit.thigh, far);
    if (outfit.shorts) {
      painter.limb(limb.hip, lerp(limb.hip, limb.knee, 0.55), 4.1 * scale, outfit.shorts, far);
    }
    painter.limb(limb.knee, limb.foot, 2.9 * scale, outfit.shin, far);
    painter.limb(limb.foot, limb.toe, 2.5 * scale, outfit.shoe, far);
  };

  const drawArm = (limb: Arm, far: boolean): void => {
    painter.limb(limb.shoulder, limb.elbow, 2.6 * scale, outfit.upper, far);
    if (outfit.sleeve) {
      painter.limb(limb.shoulder, lerp(limb.shoulder, limb.elbow, 0.45), 3.3 * scale, outfit.sleeve, far);
    }
    painter.limb(limb.elbow, limb.hand, 2.3 * scale, outfit.fore, far);
    painter.dot(limb.hand[0], limb.hand[1], 1.25 * scale, 'skin', far);
  };

  drawArm(body.arms[1], true);
  drawLeg(body.legs[1], true);
  if (outfit.pack) {
    const top = lerp(body.shoulder, body.hip, 0.12);
    const bottom = lerp(body.shoulder, body.hip, 0.62);
    const offset = 3.2 * scale;
    painter.limb(
      [top[0] + back[0] * offset, top[1] + back[1] * offset],
      [bottom[0] + back[0] * offset, bottom[1] + back[1] * offset],
      4.2 * scale,
      'expPack',
    );
  }
  painter.limb(body.shoulder, body.hip, body.bodyWidth, outfit.torso);
  if (outfit.shorts) {
    painter.limb(lerp(body.shoulder, body.hip, 0.78), body.hip, body.bodyWidth + 0.4, outfit.shorts);
  }
  if (outfit.stripe) {
    const middle = lerp(body.shoulder, body.hip, 0.5);
    const half = 2.6 * scale;
    painter.limb(
      [middle[0] - back[0] * half, middle[1] - back[1] * half],
      [middle[0] + back[0] * half, middle[1] + back[1] * half],
      1.2,
      'wkStripe',
    );
  }
  drawLeg(body.legs[0], false);
  drawHead(painter, character, body.head);
  drawArm(body.arms[0], false);
}

function drawHurdle(painter: Painter, width: number, height: number): void {
  painter.limb([0.6, height - 1], [5, height - 1], 1.8, 'metalDark');
  painter.limb([width - 5, height - 1], [width - 0.6, height - 1], 1.8, 'metalDark');
  painter.limb([2.2, height - 1], [2.2, 4], 1.8, 'metal');
  painter.limb([width - 2.2, height - 1], [width - 2.2, 4], 1.8, 'metal');
  painter.shape((c) => c.rect(0, 1, width, 4.2), 'bar');
  for (let x = 0; x < width; x += 6) {
    painter.shape((c) => c.rect(x, 1, Math.min(3, width - x), 4.2), 'barStripe');
  }
}

function drawWood(painter: Painter, width: number, height: number): void {
  if (width > height * 1.1) {
    const rx = Math.min(4.5, width * 0.14);
    const cy = height / 2;
    const ry = height / 2;
    painter.shape((c) => {
      c.ellipse(rx, cy, rx, ry, 0, Math.PI / 2, Math.PI * 1.5);
      c.lineTo(width - rx, 0);
      c.lineTo(width - rx, height);
      c.closePath();
    }, 'bark');
    for (const k of [0.28, 0.55, 0.8]) {
      painter.limb([rx + 1.5, height * k], [width - rx - 2, height * k + (k - 0.5) * 1.2], 0.8, 'barkDark');
    }
    painter.shape((c) => c.ellipse(width * 0.42, height * 0.42, 1.6, 1.2, 0, 0, Math.PI * 2), 'barkDark');
    painter.shape((c) => c.ellipse(width - rx, cy, rx, ry - 0.3, 0, 0, Math.PI * 2), 'wood');
    painter.ring(width - rx, cy, rx * 0.62, ry * 0.62, 'rings');
    painter.ring(width - rx, cy, rx * 0.28, ry * 0.28, 'rings');
    return;
  }

  const ry = Math.min(3, height * 0.1);
  const x0 = width * 0.14;
  const x1 = width * 0.86;
  const rx = (x1 - x0) / 2;
  painter.shape((c) => {
    c.moveTo(0.3, height);
    c.quadraticCurveTo(x0, height - 1.5, x0, height * 0.7);
    c.lineTo(x1, height * 0.7);
    c.quadraticCurveTo(x1, height - 1.5, width - 0.3, height);
    c.closePath();
  }, 'bark');
  painter.shape((c) => c.rect(x0, ry, x1 - x0, height - ry), 'bark');
  for (const k of [0.28, 0.62]) {
    const x = x0 + (x1 - x0) * k;
    painter.limb([x, ry + 3], [x + 0.5, height - 2.5], 0.8, 'barkDark');
  }
  painter.shape((c) => c.ellipse(x0 + rx, ry, rx, ry, 0, 0, Math.PI * 2), 'wood');
  painter.ring(x0 + rx, ry, rx * 0.6, ry * 0.6, 'rings');
  painter.ring(x0 + rx, ry, rx * 0.28, ry * 0.28, 'rings');
}

function drawCone(painter: Painter, width: number, height: number): void {
  const base = 2.4;
  const top = 0.8;
  const span = height - base - top;
  const leftBottom = width * 0.1;
  const rightBottom = width * 0.9;
  const leftTop = width * 0.38;
  const rightTop = width * 0.62;
  const leftAt = (y: number): number => leftTop + ((leftBottom - leftTop) * (y - top)) / span;
  const rightAt = (y: number): number => rightTop + ((rightBottom - rightTop) * (y - top)) / span;
  painter.shape((c) => {
    c.moveTo(leftBottom, height - base);
    c.lineTo(leftTop, top + 0.6);
    c.quadraticCurveTo(width / 2, top - 0.4, rightTop, top + 0.6);
    c.lineTo(rightBottom, height - base);
    c.closePath();
  }, 'cone');
  for (const [from, to] of [
    [0.28, 0.4],
    [0.55, 0.67],
  ]) {
    const y0 = height * from;
    const y1 = height * to;
    painter.shape((c) => {
      c.moveTo(leftAt(y0), y0);
      c.lineTo(rightAt(y0), y0);
      c.lineTo(rightAt(y1), y1);
      c.lineTo(leftAt(y1), y1);
      c.closePath();
    }, 'coneStripe');
  }
  painter.shape((c) => c.roundRect(0, height - base, width, base, 0.6), 'coneBase');
}

function drawBarricade(painter: Painter, width: number, height: number): void {
  const legTop = height * 0.22;
  for (const x of [width * 0.18, width * 0.82]) {
    painter.limb([x, legTop], [x - width * 0.1, height - 0.8], 1.6, 'metalDark', true);
    painter.limb([x, legTop], [x + width * 0.1, height - 0.8], 1.6, 'metalDark');
  }
  const board = (y: number, boardHeight: number, inset: number): void => {
    painter.shape((c) => c.rect(inset, y, width - inset * 2, boardHeight), 'board');
    const context = painter.context;
    context.save();
    context.beginPath();
    context.rect(inset, y, width - inset * 2, boardHeight);
    context.clip();
    for (let x = -boardHeight; x < width; x += 7) {
      painter.shape((c) => {
        c.moveTo(x, y + boardHeight);
        c.lineTo(x + boardHeight, y);
        c.lineTo(x + boardHeight + 3.2, y);
        c.lineTo(x + 3.2, y + boardHeight);
        c.closePath();
      }, 'boardStripe');
    }
    context.restore();
  };
  board(1, height * 0.3, 0.4);
  board(height * 0.5, height * 0.2, width * 0.06);
}

function drawGroundWorks(painter: Painter, width: number, height: number): void {
  if (width / height < 0.75) {
    drawCone(painter, width, height);
  } else {
    drawBarricade(painter, width, height);
  }
}

function drawPigeon(painter: Painter, width: number, height: number, cycle: number): void {
  const phase = cycle * Math.PI * 2 * 1.3;
  const cy = height * 0.6;
  const clamp = (v: number): number => Math.max(0.8, Math.min(height - 0.8, v));
  painter.shape((c) => {
    c.moveTo(width * 0.5, height * 0.52);
    c.lineTo(width * 0.32, clamp(height * 0.5 - height * 0.4 * Math.sin(phase + 0.5)));
    c.lineTo(width * 0.62, height * 0.6);
    c.closePath();
  }, 'birdDark', true);
  painter.shape((c) => {
    c.moveTo(width * 0.26, cy - 1);
    c.lineTo(0.6, height * 0.5);
    c.lineTo(0.6, height * 0.8);
    c.lineTo(width * 0.24, cy + 2);
    c.closePath();
  }, 'birdDark');
  painter.shape((c) => c.ellipse(width * 0.46, cy, width * 0.27, height * 0.22, -0.1, 0, Math.PI * 2), 'bird');
  painter.shape((c) => c.ellipse(width * 0.69, height * 0.5, width * 0.085, height * 0.17, 0.3, 0, Math.PI * 2), 'neck');
  const hr = height * 0.15;
  const hx = width * 0.78;
  const hy = height * 0.34;
  painter.shape((c) => c.arc(hx, hy, hr, 0, Math.PI * 2), 'bird');
  painter.shape((c) => {
    c.moveTo(hx + hr * 0.8, hy - hr * 0.2);
    c.lineTo(Math.min(width - 0.5, hx + hr * 2.1), hy + hr * 0.3);
    c.lineTo(hx + hr * 0.7, hy + hr * 0.6);
    c.closePath();
  }, 'beak');
  painter.dot(hx + hr * 0.25, hy - hr * 0.2, 0.65, 'eye');
  const tip = clamp(height * 0.5 - height * 0.46 * Math.sin(phase));
  painter.shape((c) => {
    c.moveTo(width * 0.56, height * 0.54);
    c.quadraticCurveTo(width * 0.45, (height * 0.54 + tip) / 2 - 2, width * 0.24, tip);
    c.lineTo(width * 0.3, (tip + height * 0.6) / 2);
    c.lineTo(width * 0.42, height * 0.62);
    c.closePath();
  }, 'birdWing');
}

function drawBat(painter: Painter, width: number, height: number, cycle: number): void {
  const phase = cycle * Math.PI * 2 * 2.1;
  const cx = width / 2;
  const cy = height * 0.55;
  const clamp = (v: number): number => Math.max(0.6, Math.min(height - 0.6, v));
  const tip = clamp(height * (0.42 - 0.36 * Math.sin(phase)));
  const mid = clamp(height * (0.62 - 0.16 * Math.sin(phase)));
  for (const side of [-1, 1]) {
    const x = (v: number): number => cx + side * v;
    painter.shape((c) => {
      c.moveTo(x(1.5), cy - 1.5);
      c.lineTo(x(width * 0.3), clamp(tip - 2));
      c.lineTo(x(width / 2 - 0.6), tip);
      c.quadraticCurveTo(x(width * 0.42), mid + 1, x(width * 0.36), clamp(mid + 3));
      c.quadraticCurveTo(x(width * 0.3), mid, x(width * 0.24), clamp(mid + 3.5));
      c.quadraticCurveTo(x(width * 0.17), mid + 0.5, x(width * 0.1), clamp(mid + 3));
      c.lineTo(x(1.5), cy + 2);
      c.closePath();
    }, 'batWing');
  }
  painter.shape((c) => c.ellipse(cx, cy + 0.5, 2.4, 3.8, 0, 0, Math.PI * 2), 'bat');
  const hy = cy - 3.6;
  painter.shape((c) => {
    c.moveTo(cx - 1.9, hy - 0.5);
    c.lineTo(cx - 1.6, hy - 3.6);
    c.lineTo(cx - 0.4, hy - 1.6);
    c.lineTo(cx + 0.4, hy - 1.6);
    c.lineTo(cx + 1.6, hy - 3.6);
    c.lineTo(cx + 1.9, hy - 0.5);
    c.closePath();
  }, 'bat');
  painter.shape((c) => c.arc(cx, hy, 2.1, 0, Math.PI * 2), 'bat');
  painter.dot(cx - 0.8, hy - 0.1, 0.5, 'eyeGlow');
  painter.dot(cx + 0.8, hy - 0.1, 0.5, 'eyeGlow');
}

function drawWreckingBall(painter: Painter, width: number, height: number): void {
  const radius = Math.min(width, height) / 2;
  const cx = width / 2;
  const cy = height - radius;
  let link = 0;
  for (let y = cy - radius; y > 0; y -= 3.4, link++) {
    if (link % 2 === 0) {
      painter.ring(cx, y - 2, 1.4, 2.2, 'chain', 1.2);
    } else {
      painter.limb([cx, y - 3.6], [cx, y - 0.6], 1.2, 'chain');
    }
  }
  painter.shape((c) => c.arc(cx, cy, radius, 0, Math.PI * 2), 'steel');
  painter.shape((c) => c.arc(cx - radius * 0.35, cy - radius * 0.38, radius * 0.26, 0, Math.PI * 2), 'steelLight');
  painter.shape((c) => c.roundRect(cx - 2, cy - radius - 0.4, 4, 2.6, 0.8), 'chain');
}

type ObstacleDrawer = (painter: Painter, width: number, height: number, cycle: number) => void;

interface Cast {
  character: Character;
  ground: ObstacleDrawer;
  air: ObstacleDrawer;
}

const CASTS: Record<GameTheme, Cast> = {
  city: { character: 'runner', ground: drawHurdle, air: drawPigeon },
  forest: { character: 'explorer', ground: drawWood, air: drawBat },
  construction: { character: 'worker', ground: drawGroundWorks, air: drawWreckingBall },
};

type BoxDrawer = (painter: Painter, width: number, height: number) => void;

function drawClipped(context: Context2D, box: SpriteBox, draw: BoxDrawer): void {
  context.save();
  context.translate(box.x, box.y);
  context.beginPath();
  context.rect(0, 0, box.width, box.height);
  context.clip();
  draw(createPainter(context), box.width, box.height);
  context.restore();
}

const nearestColor = new Map<number, [number, number, number]>();

function snapToPalette(r: number, g: number, b: number): [number, number, number] {
  const key = (r << 16) | (g << 8) | b;
  const cached = nearestColor.get(key);
  if (cached) {
    return cached;
  }
  let best = PIXEL_PALETTE[0];
  let bestDistance = Infinity;
  for (const candidate of PIXEL_PALETTE) {
    const distance = (r - candidate[0]) ** 2 + (g - candidate[1]) ** 2 + (b - candidate[2]) ** 2;
    if (distance < bestDistance) {
      bestDistance = distance;
      best = candidate;
    }
  }
  nearestColor.set(key, best);
  return best;
}

let pixelCanvas: OffscreenCanvas | null = null;

function drawPixelated(context: Context2D, box: SpriteBox, draw: BoxDrawer): void {
  const width = Math.ceil(box.width);
  const height = Math.ceil(box.height);
  if (width <= 0 || height <= 0) {
    return;
  }
  pixelCanvas ??= new OffscreenCanvas(width, height);
  if (pixelCanvas.width < width || pixelCanvas.height < height) {
    pixelCanvas.width = Math.max(pixelCanvas.width, width);
    pixelCanvas.height = Math.max(pixelCanvas.height, height);
  }
  const scratch = pixelCanvas.getContext('2d', { willReadFrequently: true });
  if (!scratch) {
    return;
  }
  scratch.setTransform(1, 0, 0, 1, 0, 0);
  scratch.clearRect(0, 0, width, height);
  drawClipped(scratch, { x: 0, y: 0, width, height }, draw);

  const image = scratch.getImageData(0, 0, width, height);
  const data = image.data;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < PIXEL_ALPHA_THRESHOLD) {
      data[i + 3] = 0;
      continue;
    }
    const [r, g, b] = snapToPalette(data[i], data[i + 1], data[i + 2]);
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = 255;
  }
  scratch.putImageData(image, 0, 0);

  context.save();
  context.imageSmoothingEnabled = false;
  context.drawImage(pixelCanvas, 0, 0, width, height, Math.round(box.x), Math.round(box.y), width, height);
  context.restore();
}

export function drawSprites(context: CanvasRenderingContext2D, scene: SpriteScene): void {
  const pixel = scene.style === 'pixel';
  const cycle = pixel ? Math.floor(scene.cycle * PIXEL_FRAMES_PER_CYCLE) / PIXEL_FRAMES_PER_CYCLE : scene.cycle;
  const render = pixel ? drawPixelated : drawClipped;
  const cast = CASTS[scene.theme];

  for (const obstacle of scene.obstacles) {
    render(context, obstacle, (painter, width, height) => {
      if (obstacle.kind === 'hanging') {
        drawWreckingBall(painter, width, height);
      } else {
        cast[obstacle.kind](painter, width, height, cycle);
      }
    });
  }

  const { player } = scene;
  render(context, player, (painter, width, height) =>
    drawCharacter(painter, cast.character, player.pose, cycle, width, height),
  );
}
