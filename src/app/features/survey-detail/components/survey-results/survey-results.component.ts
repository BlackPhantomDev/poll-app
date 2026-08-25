import { Component, input, signal } from '@angular/core';

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
  /** Warns that the bars below are missing votes; without it zeros read as "no votes". */
  readonly error = input<string | null>(null);

  /** True while the bars include picks that are not submitted yet. */
  readonly preview = input(false);

  /** Only drives the phone layout; from sm up the styles keep the results open regardless. */
  protected readonly expanded = signal(false);

  /** Folds the results away on phones, where they sit below the form instead of beside it. */
  protected toggle(): void {
    this.expanded.update((open) => !open);
  }
}
