import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface DesignSidebarLink {
  readonly id: string;
  readonly label: string;
}

@Component({
  selector: 'pb-design-sidebar',
  imports: [RouterLink],
  templateUrl: './pb-design-sidebar.html',
  styleUrl: './pb-design-sidebar.scss',
})
export class PbDesignSidebar {
  readonly label = input.required<string>();
  readonly links = input.required<readonly DesignSidebarLink[]>();
  readonly activeId = input<string>();

  readonly selected = output<string>();
}
