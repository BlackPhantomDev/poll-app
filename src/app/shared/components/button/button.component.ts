import { NgTemplateOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-button',
  imports: [NgTemplateOutlet, RouterLink],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  /** Set: renders a link to this route, otherwise a plain button. */
  readonly link = input<string>();
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
}
