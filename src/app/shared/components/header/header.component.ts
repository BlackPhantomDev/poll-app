import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Logo, LogoVariant } from '../logo/logo';

@Component({
  selector: 'app-header',
  imports: [Logo, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly variant = input<LogoVariant>('light');
}
