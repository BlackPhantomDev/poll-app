import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { categoryLabel } from '../../../../core/constants/categories';
import { Survey } from '../../../../core/models';

@Component({
  selector: 'app-survey-header',
  imports: [DatePipe, BadgeComponent, RouterLink],
  templateUrl: './survey-header.component.html',
  styleUrl: './survey-header.component.scss',
})
export class SurveyHeaderComponent {
  readonly survey = input.required<Survey>();

  protected readonly categoryLabel = categoryLabel;
}
