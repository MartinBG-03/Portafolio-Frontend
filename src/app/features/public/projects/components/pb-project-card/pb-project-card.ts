import { Component, input } from '@angular/core';
import { ProjectCategory } from '../../models/project.model';

@Component({
  selector: 'pb-project-card',
  templateUrl: './pb-project-card.html',
  styleUrl: './pb-project-card.scss',
})
export class PbProjectCard {
  readonly category = input.required<ProjectCategory>();
  readonly categoryLabel = input.required<string>();
  readonly heading = input.required<string>();
  readonly description = input.required<string>();
  readonly imageLabel = input('');
}
