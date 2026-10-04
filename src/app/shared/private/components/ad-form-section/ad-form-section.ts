import { Component, input } from '@angular/core';

@Component({
  selector: 'ad-form-section',
  templateUrl: './ad-form-section.html',
  styleUrl: './ad-form-section.scss',
})
export class AdFormSection {
  readonly heading = input.required<string>();
}
