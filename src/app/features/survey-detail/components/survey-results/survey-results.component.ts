import { Component, input } from '@angular/core';

import { ResultBarComponent } from '../result-bar/result-bar.component';
import { QuestionResult } from '../../../../core/models';

@Component({
  selector: 'app-survey-results',
  imports: [ResultBarComponent],
  templateUrl: './survey-results.component.html',
  styleUrl: './survey-results.component.scss',
})
export class SurveyResultsComponent {
  readonly results = input.required<QuestionResult[]>();
}
