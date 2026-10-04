import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../../../core/public/services/language.service';
import { PbButton } from '../../../../../shared/public/components/pb-button/pb-button';

@Component({
  selector: 'pb-home-contact',
  imports: [PbButton],
  templateUrl: './pb-home-contact.html',
  styleUrl: './pb-home-contact.scss',
})
export class PbHomeContact {
  protected readonly t = inject(LanguageService).t;
}
