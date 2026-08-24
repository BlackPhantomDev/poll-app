import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { EndsInPipe } from '../../../../core/pipes/ends-in.pipe';

export type SurveyCardVariant = 'featured' | 'row';

/** A survey reduced to what a card renders; the countdown is derived on display. */
export interface SurveyCardView {
  id: string;
  category: string;
  title: string;
  endDate: string | null;
}

@Component({
  selector: 'app-survey-card',
  imports: [BadgeComponent, RouterLink, EndsInPipe],
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
  readonly endDate = input.required<string | null>();
}
