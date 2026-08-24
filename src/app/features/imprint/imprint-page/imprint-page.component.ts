import { Component } from '@angular/core';

import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-imprint-page',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './imprint-page.component.html',
  styleUrl: './imprint-page.component.scss',
})
export class ImprintPageComponent {}
