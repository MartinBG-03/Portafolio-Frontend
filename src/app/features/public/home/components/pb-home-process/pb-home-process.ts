import { Component, computed, inject } from '@angular/core';
import { LanguageService } from '../../../../../core/public/services/language.service';
import { Icon } from '../../../../../shared/components/icon/icon';
import { IconName } from '../../../../../shared/components/icon/icon-registry';

interface ProcessStep {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon?: IconName;
}

@Component({
  selector: 'pb-home-process',
  imports: [Icon],
  templateUrl: './pb-home-process.html',
  styleUrl: './pb-home-process.scss',
})
export class PbHomeProcess {
  protected readonly t = inject(LanguageService).t;

  protected readonly steps = computed<readonly ProcessStep[]>(() => {
    const process = this.t().home.process;

    return [
      { id: 'discover', ...process.discover, icon: 'magnifer' },
      { id: 'design', ...process.design },
      { id: 'build', ...process.build, icon: 'code' },
      { id: 'deliver', ...process.deliver, icon: 'check-circle' },
    ];
  });
}
