import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BadgeComponent } from '../../../../shared/components/badge/badge.component';

export type SurveyCardVariant = 'featured' | 'row';

/** A survey reduced to the strings a card renders. */
export interface SurveyCardView {
  id: string;
  category: string;
  title: string;
  endsIn: string;
}

@Component({
  selector: 'app-survey-card',
  imports: [BadgeComponent, RouterLink],
  templateUrl: './survey-card.component.html',
  styleUrl: './survey-card.component.scss',
  host: {
    '[attr.data-variant]': 'variant()',
  },
})
export class SurveyCardComponent {
  readonly variant = input<SurveyCardVariant>('featured');
  readonly id = input.required<string>();
  readonly category = input.required<string>();
  readonly title = input.required<string>();
  readonly endsIn = input.required<string>();
}
