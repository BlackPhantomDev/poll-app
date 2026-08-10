import { Component } from '@angular/core';

import { ButtonComponent } from '../../../shared/components/button/button.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-not-found-page',
  imports: [HeaderComponent, ButtonComponent],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.scss',
})
export class NotFoundPageComponent {}
