import { Component, input } from '@angular/core';

import { SurveyCardComponent, SurveyCardView } from '../survey-card/survey-card.component';

@Component({
  selector: 'app-survey-list',
  imports: [SurveyCardComponent],
  templateUrl: './survey-list.component.html',
  styleUrl: './survey-list.component.scss',
})
export class SurveyListComponent {
  readonly surveys = input.required<SurveyCardView[]>();
}
