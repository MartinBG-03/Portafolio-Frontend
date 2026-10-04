import { Directive, inject, input, TemplateRef } from '@angular/core';
import { AdTableRowContext, AdTableToolbarContext } from '../../interfaces/ad-table.interface';

@Directive({ selector: 'ng-template[adTableCell]' })
export class AdTableCell<T = unknown> {
  readonly columnKey = input.required<string>({ alias: 'adTableCell' });
  readonly template = inject<TemplateRef<AdTableRowContext<T>>>(TemplateRef);
}

@Directive({ selector: 'ng-template[adTableActions]' })
export class AdTableActions<T = unknown> {
  readonly template = inject<TemplateRef<AdTableRowContext<T>>>(TemplateRef);
}

@Directive({ selector: 'ng-template[adTableToolbar]' })
export class AdTableToolbarActions<T = unknown> {
  readonly template = inject<TemplateRef<AdTableToolbarContext<T>>>(TemplateRef);
}
