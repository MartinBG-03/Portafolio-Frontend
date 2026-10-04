export type AdTooltipPlacement = 'top' | 'bottom';

export interface AdTooltipPosition {
  readonly top: number;
  readonly left: number;
  readonly placement: AdTooltipPlacement;
}
