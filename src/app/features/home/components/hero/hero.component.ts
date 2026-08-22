import { Component, output } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AddIconComponent } from '../../../../shared/components/add-icon/add-icon.component';

@Component({
  selector: 'app-hero',
  imports: [ButtonComponent, AddIconComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  readonly newSurvey = output<void>();
}