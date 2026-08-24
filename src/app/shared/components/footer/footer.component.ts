import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Variant of the surrounding page background the footer sits on. */
export type FooterVariant = 'light' | 'dark';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  /** `dark` renders dark text for pages with a light background. */
  readonly variant = input<FooterVariant>('light');

  readonly year = new Date().getFullYear();
}
