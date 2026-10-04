import { Component, inject } from '@angular/core';
import { AdToastService } from '../../services/ad-toast.service';
import { AdAlert } from '../ad-alert/ad-alert';

@Component({
  selector: 'ad-toast-stack',
  imports: [AdAlert],
  templateUrl: './ad-toast-stack.html',
  styleUrl: './ad-toast-stack.scss',
})
export class AdToastStack {
  protected readonly toastService = inject(AdToastService);
}
