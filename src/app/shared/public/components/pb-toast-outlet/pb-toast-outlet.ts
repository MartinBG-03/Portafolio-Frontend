import { Component, inject } from '@angular/core';
import { ToastService } from '../../../../core/public/services/toast.service';
import { PbToast } from '../pb-toast/pb-toast';

@Component({
  selector: 'pb-toast-outlet',
  imports: [PbToast],
  templateUrl: './pb-toast-outlet.html',
  styleUrl: './pb-toast-outlet.scss',
})
export class PbToastOutlet {
  protected readonly toastService = inject(ToastService);
}
