import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RealtimeChannel } from '@supabase/supabase-js';
import { MockInstance, vi } from 'vitest';

import { SurveyDetailPageComponent } from './survey-detail-page.component';
import { SupabaseService } from '../../../core/services/supabase.service';
import { SurveyService } from '../../../core/services/survey.service';
import { ResponseService } from '../../../core/services/response.service';
import { ResponseVotes, ResultsService } from '../../../core/services/results.service';
import { SurveyWithQuestions } from '../../../core/models';

const DAY = 86_400_000;
const SURVEY_ID = 'survey-1';

const CHANNEL = {} as RealtimeChannel;

function surveyWithQuestions(endsInDays: number | null): SurveyWithQuestions {
  return {
    id: SURVEY_ID,
    title: 'Team lunch',
    description: null,
    category: 'team-activities',
    end_date: endsInDays === null ? null : new Date(Date.now() + endsInDays * DAY).toISOString(),
    created_at: new Date().toISOString(),
    questions: [
      {
        id: 'q1',
        survey_id: SURVEY_ID,
        text: 'Which day works?',
        position: 0,
        allow_multiple: false,
        options: [
          { id: 'o1', label: 'Monday' },
          { id: 'o2', label: 'Tuesday' },
        ],
      },
    ],
  };
}

interface SetupOptions {
  survey?: SurveyWithQuestions | Error;
  responses?: ResponseVotes[] | Error;
  voted?: boolean;
}

describe('SurveyDetailPageComponent', () => {
  let component: SurveyDetailPageComponent;
  let fixture: ComponentFixture<SurveyDetailPageComponent>;
  let watchResponses: MockInstance<ResultsService['watchResponses']>;
  let removeChannel: MockInstance<ResultsService['removeChannel']>;
  let submitResponse: MockInstance<ResponseService['submitResponse']>;
  let markVoted: MockInstance<ResponseService['markVoted']>;

  async function setup(options: SetupOptions = {}): Promise<void> {
    const survey = options.survey ?? surveyWithQuestions(2);
    const responses = options.responses ?? [];

    await TestBed.configureTestingModule({
      imports: [SurveyDetailPageComponent],
      providers: [
        provideRouter([]),
        { provide: SupabaseService, useValue: { client: {} } },
        {
          provide: SurveyService,
          useValue: {
            getSurvey: () =>
              survey instanceof Error ? Promise.reject(survey) : Promise.resolve(survey),
          },
        },
      ],
    }).compileComponents();

    const resultsService = TestBed.inject(ResultsService);
    const responseService = TestBed.inject(ResponseService);

    vi.spyOn(resultsService, 'getResponses').mockImplementation(() =>
      responses instanceof Error ? Promise.reject(responses) : Promise.resolve(responses),
    );
    watchResponses = vi.spyOn(resultsService, 'watchResponses').mockReturnValue(CHANNEL);
    removeChannel = vi.spyOn(resultsService, 'removeChannel').mockImplementation(() => undefined);

    vi.spyOn(responseService, 'hasVoted').mockReturnValue(options.voted ?? false);
    markVoted = vi.spyOn(responseService, 'markVoted').mockImplementation(() => undefined);
    submitResponse = vi.spyOn(responseService, 'submitResponse').mockResolvedValue(undefined);

    fixture = TestBed.createComponent(SurveyDetailPageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', SURVEY_ID);
    await fixture.whenStable();
  }

  function notice(): string | null {
    const element = fixture.nativeElement.querySelector('.participate__notice');

    return element === null ? null : element.textContent.trim();
  }

  it('should create', async () => {
    await setup();

    expect(component).toBeTruthy();
  });

  it('shows the survey once it loaded', async () => {
    await setup();

    expect(fixture.nativeElement.querySelector('app-survey-header')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-survey-participate-form')).toBeTruthy();
  });

  it('locks the form for a survey that has ended', async () => {
    await setup({ survey: surveyWithQuestions(-2) });

    expect(component['formDisabled']()).toBe(true);
    expect(notice()).toBe('This survey has ended. The results stay visible.');
  });

  it('keeps the form open while the survey is still running', async () => {
    await setup();

    expect(component['formDisabled']()).toBe(false);
    expect(notice()).toBeNull();
  });

  it('locks the form when this browser already voted', async () => {
    await setup({ voted: true });

    expect(component['formDisabled']()).toBe(true);
    expect(notice()).toContain('You already took part');
  });

  it('writes one participation and locks the form afterwards', async () => {
    await setup();

    await component['submit']([{ question_id: 'q1', option_ids: ['o1'] }]);
    await fixture.whenStable();

    expect(submitResponse).toHaveBeenCalledTimes(1);
    expect(markVoted).toHaveBeenCalledWith(SURVEY_ID);
    expect(component['formDisabled']()).toBe(true);
  });

  it('keeps the form open when the participation could not be stored', async () => {
    await setup();
    submitResponse.mockRejectedValue(new Error('offline'));

    await component['submit']([{ question_id: 'q1', option_ids: ['o1'] }]);
    await fixture.whenStable();

    expect(markVoted).not.toHaveBeenCalled();
    expect(component['formDisabled']()).toBe(false);
    expect(notice()).toBe('Your answers could not be submitted. Please try again.');
  });

  it('counts a participation that arrives over realtime', async () => {
    await setup({ responses: [{ id: 'r1', answers: [{ question_id: 'q1', option_ids: ['o1'] }] }] });

    expect(component['results']()[0].options[0].percent).toBe(100);

    const onInsert = watchResponses.mock.calls[0][1];
    onInsert({ id: 'r2', answers: [{ question_id: 'q1', option_ids: ['o2'] }] });
    await fixture.whenStable();

    expect(component['results']()[0].options.map((option) => option.percent)).toEqual([50, 50]);
  });

  it('ignores a realtime row that is already counted', async () => {
    const row: ResponseVotes = { id: 'r1', answers: [{ question_id: 'q1', option_ids: ['o1'] }] };
    await setup({ responses: [row] });

    const onInsert = watchResponses.mock.calls[0][1];
    onInsert(row);
    await fixture.whenStable();

    expect(component['results']()[0].options[0].votes).toBe(1);
  });

  it('closes the realtime channel when the page goes away', async () => {
    await setup();
    expect(removeChannel).not.toHaveBeenCalled();

    fixture.destroy();

    expect(removeChannel).toHaveBeenCalledWith(CHANNEL);
  });

  it('says so when the results could not be loaded', async () => {
    await setup({ responses: new Error('offline') });

    expect(component['resultsError']()).toBe(
      'Results could not be loaded and may be incomplete.',
    );
    expect(fixture.nativeElement.querySelector('app-survey-header')).toBeTruthy();
  });

  it('offers a retry when the survey itself could not be loaded', async () => {
    await setup({ survey: new Error('offline') });

    expect(fixture.nativeElement.querySelector('.detail__error')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-survey-participate-form')).toBeNull();
  });
});
