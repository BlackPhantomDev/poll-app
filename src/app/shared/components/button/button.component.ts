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
  /** Gesetzt: rendert einen Link auf diese Route, sonst einen normalen Button. */
  readonly link = input<string>();
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
}
