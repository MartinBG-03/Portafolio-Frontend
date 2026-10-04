import { Directive, inject, input, TemplateRef } from '@angular/core';

@Directive({ selector: 'ng-template[adWizardStep]' })
export class AdWizardStepContent {
  readonly key = input.required<string>({ alias: 'adWizardStep' });
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}
