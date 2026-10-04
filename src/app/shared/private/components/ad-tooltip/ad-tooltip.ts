import { Component, signal } from '@angular/core';
import { adUniqueId } from '../ad-form-field/ad-field-control';
import { AdTooltipPosition } from '../../interfaces/ad-tooltip.interface';

@Component({
  selector: 'ad-tooltip',
  templateUrl: './ad-tooltip.html',
  styleUrl: './ad-tooltip.scss',
})
export class AdTooltip {
  readonly id = adUniqueId('ad-tooltip');
  readonly text = signal('');
  readonly position = signal<AdTooltipPosition>({ top: 0, left: 0, placement: 'bottom' });
}
