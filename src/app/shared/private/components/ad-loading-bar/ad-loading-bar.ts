import { Component, inject } from '@angular/core';
import { AdLoadingService } from '../../services/ad-loading.service';

@Component({
  selector: 'ad-loading-bar',
  templateUrl: './ad-loading-bar.html',
  styleUrl: './ad-loading-bar.scss',
})
export class AdLoadingBar {
  protected readonly loadingService = inject(AdLoadingService);
}
