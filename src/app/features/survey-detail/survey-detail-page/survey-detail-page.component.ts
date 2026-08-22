import { Component, computed, inject, input, linkedSignal, resource, signal } from '@angular/core';

import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SurveyHeaderComponent } from '../components/survey-header/survey-header.component';
import { SurveyParticipateFormComponent } from '../components/survey-participate-form/survey-participate-form.component';
import { SurveyResultsComponent } from '../components/survey-results/survey-results.component';
import { SurveyService } from '../../../core/services/survey.service';
import { ResponseService } from '../../../core/services/response.service';
import { Answer } from '../../../core/models';

@Component({
  selector: 'app-survey-detail-page',
  imports: [
    HeaderComponent,
    SurveyHeaderComponent,
    SurveyParticipateFormComponent,
    SurveyResultsComponent,
  ],
  templateUrl: './survey-detail-page.component.html',
  styleUrl: './survey-detail-page.component.scss',
})
export class SurveyDetailPageComponent {
  private readonly surveyService = inject(SurveyService);
  private readonly responseService = inject(ResponseService);

  readonly id = input.required<string>();

  protected readonly surveyResource = resource({
    params: () => this.id(),
    loader: ({ params }) => this.surveyService.getSurvey(params),
  });

  protected readonly voted = linkedSignal(() => this.responseService.hasVoted(this.id()));

  protected readonly submitting = signal(false);

  protected readonly expired = computed(() => {
    const endDate = this.surveyResource.hasValue() ? this.surveyResource.value().end_date : null;

    return endDate !== null && new Date(endDate) <= new Date();
  });

  protected readonly formDisabled = computed(
    () => this.voted() || this.expired() || this.submitting(),
  );

  /** Stores one participation row and locks the form for this browser. */
  protected async submit(answers: Answer[]): Promise<void> {
    this.submitting.set(true);

    try {
      await this.responseService.submitResponse(this.id(), answers);
      this.responseService.markVoted(this.id());
      this.voted.set(true);
    } finally {
      this.submitting.set(false);
    }
  }
}
