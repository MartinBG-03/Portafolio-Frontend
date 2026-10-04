export interface RoundedPolygonCorner {
  readonly x: number;
  readonly y: number;
  readonly radius: number;
}

export function roundedPolygonPath(corners: readonly RoundedPolygonCorner[]): string {
  const total = corners.length;
  const segments = corners.map((corner, index) => {
    const previous = corners[(index - 1 + total) % total];
    const next = corners[(index + 1) % total];
    const inX = Math.sign(corner.x - previous.x);
    const inY = Math.sign(corner.y - previous.y);
    const outX = Math.sign(next.x - corner.x);
    const outY = Math.sign(next.y - corner.y);
    const sweep = inX * outY - inY * outX > 0 ? 1 : 0;
    const radius = corner.radius;
    const startX = corner.x - inX * radius;
    const startY = corner.y - inY * radius;
    const endX = corner.x + outX * radius;
    const endY = corner.y + outY * radius;
    return { start: `${startX} ${startY}`, arc: `A ${radius} ${radius} 0 0 ${sweep} ${endX} ${endY}` };
  });

  const [first, ...rest] = segments;
  const body = rest.map((segment) => `L ${segment.start} ${segment.arc}`).join(' ');
  return `M ${first.start} ${first.arc} ${body} Z`;
}
