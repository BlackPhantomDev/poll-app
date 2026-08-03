import { Component } from '@angular/core';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';

@Component({
  selector: 'app-survey-card',
  imports: [BadgeComponent],
  templateUrl: './survey-card.component.html',
  styleUrl: './survey-card.component.scss',
})
export class SurveyCardComponent {}
