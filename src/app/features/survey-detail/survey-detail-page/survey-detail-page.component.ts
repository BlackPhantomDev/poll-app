import {
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  resource,
  signal,
} from '@angular/core';

import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AddIconComponent } from '../../../shared/components/add-icon/add-icon.component';
import { SurveyCreateDialogComponent } from '../../survey-create/survey-create-dialog/survey-create-dialog.component';
import { SurveyHeaderComponent } from '../components/survey-header/survey-header.component';
import { SurveyParticipateFormComponent } from '../components/survey-participate-form/survey-participate-form.component';
import { SurveyResultsComponent } from '../components/survey-results/survey-results.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { SurveyService } from '../../../core/services/survey.service';
import { ResponseService } from '../../../core/services/response.service';
import { ResultsService, ResponseVotes } from '../../../core/services/results.service';
import { Answer } from '../../../core/models';

/** Marks the preview row apart from the stored participations, which carry a UUID. */
const PREVIEW_RESPONSE_ID = 'preview';

@Component({
  selector: 'app-survey-detail-page',
  imports: [
    HeaderComponent,
    ButtonComponent,
    AddIconComponent,
    SurveyCreateDialogComponent,
    SurveyHeaderComponent,
    SurveyParticipateFormComponent,
    SurveyResultsComponent,
    LoadingSpinnerComponent,
    FooterComponent,
  ],
  templateUrl: './survey-detail-page.component.html',
  styleUrl: './survey-detail-page.component.scss',
})
export class SurveyDetailPageComponent {
  private readonly surveyService = inject(SurveyService);
  private readonly responseService = inject(ResponseService);
  private readonly resultsService = inject(ResultsService);

  readonly id = input.required<string>();

  protected readonly createOpen = signal(false);

  protected readonly surveyResource = resource({
    params: () => this.id(),
    loader: ({ params }) => this.surveyService.getSurvey(params),
  });

  private readonly responsesResource = resource({
    params: () => this.id(),
    loader: ({ params }) => this.resultsService.getResponses(params),
  });

  /**
   * Loaded participations plus every row that arrived over realtime since. `value()`
   * throws after a failed load, so reading it has to go through `hasValue()`.
   */
  private readonly responses = linkedSignal<ResponseVotes[]>(() =>
    this.responsesResource.hasValue() ? this.responsesResource.value() : [],
  );

  /**
   * The picks of this visitor, reset when the page switches to another survey. They
   * stay here until Complete is pressed – nothing of this reaches the database.
   */
  protected readonly picks = linkedSignal<string, Answer[]>({
    source: () => this.id(),
    computation: () => [],
  });

  /** Questions the visitor has not answered yet contribute nothing to the bars. */
  protected readonly previewVotes = computed(() =>
    this.picks().filter((answer) => answer.option_ids.length > 0),
  );

  /** Stored participations plus the own picks, counted as one more participation. */
  private readonly countedResponses = computed<ResponseVotes[]>(() => {
    const preview = this.previewVotes();

    return preview.length === 0
      ? this.responses()
      : [...this.responses(), { id: PREVIEW_RESPONSE_ID, answers: preview }];
  });

  protected readonly results = computed(() => {
    const questions = this.surveyResource.hasValue() ? this.surveyResource.value().questions : [];

    return this.resultsService.buildResults(
      questions,
      this.resultsService.countVotes(this.countedResponses()),
    );
  });

  protected readonly voted = linkedSignal(() => this.responseService.hasVoted(this.id()));

  protected readonly submitting = signal(false);

  /** Set when a participation could not be written; cleared on the next attempt. */
  protected readonly submitError = signal<string | null>(null);

  /**
   * Without this the results silently render every bar at zero, which reads as
   * "nobody voted yet" instead of "the count is missing".
   */
  protected readonly resultsError = computed(() =>
    this.responsesResource.error() !== undefined
      ? 'Results could not be loaded and may be incomplete.'
      : null,
  );

  protected readonly expired = computed(() => {
    const endDate = this.surveyResource.hasValue() ? this.surveyResource.value().end_date : null;

    return endDate !== null && new Date(endDate) <= new Date();
  });

  protected readonly formDisabled = computed(
    () => this.voted() || this.expired() || this.submitting(),
  );

  /** Tells the visitor why the form is locked; the disabled cursor alone reads as a glitch. */
  protected readonly notice = computed(() => {
    if (this.voted()) {
      return 'You already took part in this survey. Your answers are counted in the results.';
    }

    if (this.expired()) {
      return 'This survey has ended. The results stay visible.';
    }

    return null;
  });

  /**
   * Holds the realtime subscription. Publishing from this page navigates to another
   * /survey/:id and reuses the component, so the channel has to follow the id; the
   * cleanup also runs when the page is destroyed.
   */
  private readonly realtime = effect((onCleanup) => {
    const channel = this.resultsService.watchResponses(this.id(), (row) => this.addResponse(row));

    onCleanup(() => this.resultsService.removeChannel(channel));
  });

  /**
   * Stores one participation row and locks the form for this browser. The row is kept
   * right away, so the preview turns into a counted vote without the bars jumping while
   * the realtime event is still on its way.
   */
  protected async submit(answers: Answer[]): Promise<void> {
    this.submitting.set(true);
    this.submitError.set(null);

    try {
      const id = await this.responseService.submitResponse(this.id(), answers);

      this.responseService.markVoted(this.id());
      this.addResponse({ id, answers });
      this.picks.set([]);
      this.voted.set(true);
    } catch {
      this.submitError.set('Your answers could not be submitted. Please try again.');
    } finally {
      this.submitting.set(false);
    }
  }

  /** Loads survey and participations again; either request may have been the one that failed. */
  protected retry(): void {
    this.surveyResource.reload();
    this.responsesResource.reload();
  }

  /** Adds a participation from realtime; rows already counted are ignored. */
  private addResponse(row: ResponseVotes): void {
    this.responses.update((current) =>
      current.some((response) => response.id === row.id) ? current : [...current, row],
    );
  }
}
