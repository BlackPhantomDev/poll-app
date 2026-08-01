import { Component, input } from '@angular/core';

export type LogoVariant = 'light' | 'dark';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
  host: {
    '[class.logo--dark]': 'variant() === "dark"',
  },
})
export class Logo {
  readonly variant = input<LogoVariant>('light');
}
