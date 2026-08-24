import { Component, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-close-button',
  imports: [NgTemplateOutlet, RouterLink],
  templateUrl: './close-button.component.html',
  styleUrl: './close-button.component.scss',
})
export class CloseButtonComponent {
  /** Set: renders a link to this route, otherwise a plain button. */
  readonly link = input<string>();
  readonly label = input('Close');
}
