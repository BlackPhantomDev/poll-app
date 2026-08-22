import { Component, input } from '@angular/core';

import { SurveyCardComponent, SurveyCardView } from '../survey-card/survey-card.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-ending-soon',
  imports: [SurveyCardComponent, EmptyStateComponent],
  templateUrl: './ending-soon.component.html',
  styleUrl: './ending-soon.component.scss',
})
export class EndingSoonComponent {
  readonly surveys = input.required<SurveyCardView[]>();
}
