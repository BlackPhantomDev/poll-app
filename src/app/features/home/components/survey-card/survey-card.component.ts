import { Component, input } from '@angular/core';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';

export type SurveyCardVariant = 'featured' | 'row';

@Component({
  selector: 'app-survey-card',
  imports: [BadgeComponent],
  templateUrl: './survey-card.component.html',
  styleUrl: './survey-card.component.scss',
  host: {
    '[attr.data-variant]': 'variant()',
  },
})
export class SurveyCardComponent {
  readonly variant = input<SurveyCardVariant>('featured');
  readonly category = input.required<string>();
  readonly title = input.required<string>();
  readonly endsIn = input.required<string>();
}