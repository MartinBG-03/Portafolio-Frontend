export type RunnerStatus = 'idle' | 'running' | 'over';

export type RunnerObstacleKind = 'ground' | 'air' | 'hanging';

export interface RunnerObstacle {
  x: number;
  width: number;
  height: number;
  bottom: number;
  kind: RunnerObstacleKind;
}

export interface RunnerState {
  status: RunnerStatus;
  playerY: number;
  velocityY: number;
  isDucking: boolean;
  obstacles: RunnerObstacle[];
  speed: number;
  distance: number;
  nextSpawnIn: number;
}

export const RUNNER_CONFIG = {
  height: 130,
  groundOffset: 20,
  playerX: 32,
  playerSize: 28,
  duckSize: 14,
  airGap: 14,
  airThickness: 20,
  airChance: 0.35,
  hangingWidth: 20,
  gravity: 2200,
  jumpVelocity: 563,
  startSpeed: 360,
  maxSpeed: 760,
  acceleration: 9,
  pointsPerPixel: 1 / 40,
  hitboxInset: 4,
  maxDelta: 1 / 30,
} as const;

export const groundY = (): number => RUNNER_CONFIG.height - RUNNER_CONFIG.groundOffset;

export function createRunner(): RunnerState {
  return {
    status: 'idle',
    playerY: 0,
    velocityY: 0,
    isDucking: false,
    obstacles: [],
    speed: RUNNER_CONFIG.startSpeed,
    distance: 0,
    nextSpawnIn: 0,
  };
}

export function startRunner(): RunnerState {
  return { ...createRunner(), status: 'running', nextSpawnIn: RUNNER_CONFIG.startSpeed };
}

export function isGrounded(state: RunnerState): boolean {
  return state.playerY === 0;
}

export function jump(state: RunnerState): RunnerState {
  if (state.status !== 'running' || !isGrounded(state)) {
    return state;
  }
  return { ...state, velocityY: RUNNER_CONFIG.jumpVelocity };
}

export function setDucking(state: RunnerState, isDucking: boolean): RunnerState {
  return state.isDucking === isDucking ? state : { ...state, isDucking };
}

export function score(state: RunnerState): number {
  return Math.floor(state.distance * RUNNER_CONFIG.pointsPerPixel);
}

export function createObstacle(x: number, random: () => number, hanging = false): RunnerObstacle {
  if (random() < RUNNER_CONFIG.airChance) {
    if (hanging) {
      return {
        x,
        width: RUNNER_CONFIG.hangingWidth,
        height: groundY() - RUNNER_CONFIG.airGap,
        bottom: RUNNER_CONFIG.airGap,
        kind: 'hanging',
      };
    }
    return {
      x,
      width: 26 + Math.round(random() * 10),
      height: RUNNER_CONFIG.airThickness,
      bottom: RUNNER_CONFIG.airGap,
      kind: 'air',
    };
  }

  const wide = random() < 0.25;
  return {
    x,
    width: wide ? 30 + Math.round(random() * 10) : 14 + Math.round(random() * 8),
    height: 22 + Math.round(random() * 22),
    bottom: 0,
    kind: 'ground',
  };
}

export function collides(state: RunnerState): boolean {
  const { playerX, playerSize, duckSize, hitboxInset } = RUNNER_CONFIG;
  const left = playerX + hitboxInset;
  const right = playerX + playerSize - hitboxInset;
  const height = state.isDucking ? duckSize : playerSize;
  const playerBottom = state.playerY + hitboxInset;
  const playerTop = state.playerY + height - hitboxInset;

  return state.obstacles.some((obstacle) => {
    if (right <= obstacle.x || left >= obstacle.x + obstacle.width) {
      return false;
    }
    return playerBottom < obstacle.bottom + obstacle.height && playerTop > obstacle.bottom;
  });
}

export function step(
  state: RunnerState,
  delta: number,
  width: number,
  hanging = false,
  random: () => number = Math.random,
): RunnerState {
  if (state.status !== 'running') {
    return state;
  }

  const dt = Math.min(delta, RUNNER_CONFIG.maxDelta);
  const moved = state.speed * dt;

  let velocityY = state.velocityY - RUNNER_CONFIG.gravity * dt;
  let playerY = state.playerY + state.velocityY * dt;
  if (playerY <= 0) {
    playerY = 0;
    velocityY = 0;
  }

  const obstacles = state.obstacles
    .map((obstacle) => ({ ...obstacle, x: obstacle.x - moved }))
    .filter((obstacle) => obstacle.x + obstacle.width > 0);

  let nextSpawnIn = state.nextSpawnIn - moved;
  if (nextSpawnIn <= 0) {
    obstacles.push(createObstacle(width, random, hanging));
    nextSpawnIn = state.speed * (0.7 + random() * 0.9);
  }

  const next: RunnerState = {
    status: 'running',
    playerY,
    velocityY,
    isDucking: state.isDucking,
    obstacles,
    speed: Math.min(state.speed + RUNNER_CONFIG.acceleration * dt, RUNNER_CONFIG.maxSpeed),
    distance: state.distance + moved,
    nextSpawnIn,
  };

  return collides(next) ? { ...next, status: 'over' } : next;
}
