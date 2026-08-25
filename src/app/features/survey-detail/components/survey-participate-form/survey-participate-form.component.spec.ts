import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyParticipateFormComponent } from './survey-participate-form.component';
import { Answer, Question } from '../../../../core/models';

const QUESTION: Question = {
  id: 'q1',
  survey_id: 'survey-1',
  text: 'Which day works?',
  position: 0,
  allow_multiple: false,
  options: [
    { id: 'o1', label: 'Monday' },
    { id: 'o2', label: 'Tuesday' },
  ],
};

describe('SurveyParticipateFormComponent', () => {
  let component: SurveyParticipateFormComponent;
  let fixture: ComponentFixture<SurveyParticipateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyParticipateFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyParticipateFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('questions', []);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('reports every pick without submitting it', async () => {
    const reported: Answer[][] = [];
    let submits = 0;

    fixture.componentRef.setInput('questions', [QUESTION]);
    component.selectionChanged.subscribe((answers) => reported.push(answers));
    component.submitted.subscribe(() => (submits += 1));
    await fixture.whenStable();

    const option: HTMLInputElement = fixture.nativeElement.querySelector('input[type="radio"]');
    option.click();
    await fixture.whenStable();

    expect(reported).toEqual([[{ question_id: 'q1', option_ids: ['o1'] }]]);
    expect(submits).toBe(0);
  });

  it('submits the same answers it last reported', async () => {
    const submitted: Answer[][] = [];

    fixture.componentRef.setInput('questions', [QUESTION]);
    component.submitted.subscribe((answers) => submitted.push(answers));
    await fixture.whenStable();

    const option: HTMLInputElement = fixture.nativeElement.querySelector('input[type="radio"]');
    option.click();
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.participate__submit button');
    button.click();
    await fixture.whenStable();

    expect(submitted).toEqual([[{ question_id: 'q1', option_ids: ['o1'] }]]);
  });
});
