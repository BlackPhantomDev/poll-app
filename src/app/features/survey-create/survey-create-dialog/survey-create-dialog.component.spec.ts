import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { MockInstance, vi } from 'vitest';

import { SurveyCreateDialogComponent } from './survey-create-dialog.component';
import { SurveyService } from '../../../core/services/survey.service';

const NEW_SURVEY_ID = 'created-survey';

/**
 * jsdom ships `HTMLDialogElement` but neither `showModal` nor `close`, and the
 * component opens itself in `ngAfterViewInit`. These stubs only track `open`.
 */
function stubDialogMethods(): void {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.open = true;
  };

  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    if (!this.open) {
      return;
    }

    this.open = false;
    this.dispatchEvent(new Event('close'));
  };
}

describe('SurveyCreateDialogComponent', () => {
  let component: SurveyCreateDialogComponent;
  let fixture: ComponentFixture<SurveyCreateDialogComponent>;
  let createSurvey: MockInstance<SurveyService['createSurvey']>;
  let navigate: MockInstance<Router['navigate']>;

  beforeAll(stubDialogMethods);

  beforeEach(async () => {
    createSurvey = vi.fn().mockResolvedValue(NEW_SURVEY_ID);

    await TestBed.configureTestingModule({
      imports: [SurveyCreateDialogComponent],
      providers: [provideRouter([]), { provide: SurveyService, useValue: { createSurvey } }],
    }).compileComponents();

    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(SurveyCreateDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  function dialog(): HTMLDialogElement {
    return fixture.nativeElement.querySelector('dialog');
  }

  function confirmDialog(): HTMLDialogElement {
    return fixture.nativeElement.querySelector('dialog.confirm');
  }

  function fillValidForm(): void {
    const form = component['form'];

    form.patchValue({
      title: '  Team lunch  ',
      description: '  Where should we go?  ',
      category: 'team-activities',
      endDate: '2026-12-24',
    });

    const question = form.controls.questions.at(0);
    question.controls.text.setValue('  Which day?  ');
    question.controls.options.at(0).controls.label.setValue('  Monday  ');
    question.controls.options.at(1).controls.label.setValue('  Tuesday  ');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens itself as a modal', () => {
    expect(dialog().open).toBe(true);
  });

  it('starts with one question holding two answer options', () => {
    const questions = component['form'].controls.questions;

    expect(questions.length).toBe(1);
    expect(questions.at(0).controls.options.length).toBe(2);
  });

  it('does not reach the server with an incomplete form', async () => {
    await component['publish']();
    await fixture.whenStable();

    expect(createSurvey).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('.dialog-footer__error')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('[aria-invalid="true"]').length).toBe(4);
  });

  it('publishes trimmed values with the ids created alongside the fields', async () => {
    fillValidForm();
    const question = component['form'].controls.questions.at(0);
    const questionId = question.controls.id.value;
    const optionIds = question.controls.options.controls.map(
      (option) => option.controls.id.value,
    );

    await component['publish']();
    await fixture.whenStable();

    expect(createSurvey).toHaveBeenCalledWith({
      title: 'Team lunch',
      description: 'Where should we go?',
      category: 'team-activities',
      endDate: '2026-12-24',
      questions: [
        {
          id: questionId,
          text: 'Which day?',
          position: 0,
          allow_multiple: false,
          options: [
            { id: optionIds[0], label: 'Monday' },
            { id: optionIds[1], label: 'Tuesday' },
          ],
        },
      ],
    });
  });

  it('numbers the positions in display order', async () => {
    fillValidForm();
    component['addQuestion']();
    const second = component['form'].controls.questions.at(1);
    second.controls.text.setValue('Which venue?');
    second.controls.options.at(0).controls.label.setValue('Cafeteria');
    second.controls.options.at(1).controls.label.setValue('Bistro');

    await component['publish']();
    await fixture.whenStable();

    const input = createSurvey.mock.calls[0][0];

    expect(input.questions.map((question) => question.position)).toEqual([0, 1]);
  });

  it('sends the visitor to the published survey', async () => {
    fillValidForm();

    await component['publish']();
    await fixture.whenStable();

    expect(navigate).toHaveBeenCalledWith(['/survey', NEW_SURVEY_ID]);
    expect(dialog().open).toBe(false);
  });

  it('stays open and keeps the input when publishing failed', async () => {
    fillValidForm();
    createSurvey.mockRejectedValue(new Error('offline'));

    await component['publish']();
    await fixture.whenStable();

    expect(navigate).not.toHaveBeenCalled();
    expect(dialog().open).toBe(true);
    expect(fixture.nativeElement.querySelector('.dialog-footer__error').textContent).toContain(
      'could not be published',
    );
    expect(component['form'].controls.title.value).toBe('  Team lunch  ');
  });

  it('keeps at least one question', () => {
    component['removeQuestion'](0);

    expect(component['form'].controls.questions.length).toBe(1);
  });

  it('removes a question once a second one exists', () => {
    component['addQuestion']();
    component['removeQuestion'](0);

    expect(component['form'].controls.questions.length).toBe(1);
  });

  it('gives every added question its own two options', () => {
    component['addQuestion']();
    const questions = component['form'].controls.questions;
    const ids = questions.controls.map((question) => question.controls.id.value);

    expect(questions.at(1).controls.options.length).toBe(2);
    expect(new Set(ids).size).toBe(2);
  });

  it('closes without asking while nothing was typed', () => {
    component['close']();

    expect(dialog().open).toBe(false);
    expect(confirmDialog().open).toBe(false);
  });

  it('asks before discarding typed input', () => {
    component['form'].controls.title.setValue('Team lunch');
    component['form'].markAsDirty();

    component['close']();

    expect(dialog().open).toBe(true);
    expect(confirmDialog().open).toBe(true);
  });
});
