import { Component, input } from '@angular/core';

import { SurveyCardComponent, SurveyCardView } from '../survey-card/survey-card.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-ending-soon',
  imports: [SurveyCardComponent, EmptyStateComponent, LoadingSpinnerComponent],
  templateUrl: './ending-soon.component.html',
  styleUrl: './ending-soon.component.scss',
})
export class EndingSoonComponent {
  readonly surveys = input.required<SurveyCardView[]>();
  readonly loading = input(false);
  /** Shown instead of the cards; the page decides whether that is "empty" or "failed". */
  readonly message = input('No surveys ending soon.');
}
