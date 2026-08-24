import { AfterViewInit, Component, computed, ElementRef, inject, output, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { QuestionEditorComponent } from '../components/question-editor/question-editor.component';
import { SurveyMetaFormComponent } from '../components/survey-meta-form/survey-meta-form.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { CloseButtonComponent } from '../../../shared/components/close-button/close-button.component';
import { SurveyService } from '../../../core/services/survey.service';
import {
  createQuestionForm,
  createSurveyForm,
  firstInvalidFieldId,
  MIN_QUESTIONS,
  QuestionForm,
} from '../survey-create-form';

@Component({
  imports: [
    ReactiveFormsModule,
    QuestionEditorComponent,
    SurveyMetaFormComponent,
    ButtonComponent,
    BadgeComponent,
    CloseButtonComponent,
  ],
  selector: 'app-survey-create-dialog',
  templateUrl: './survey-create-dialog.component.html',
  styleUrl: './survey-create-dialog.component.scss',
})
export class SurveyCreateDialogComponent implements AfterViewInit {
  private readonly surveyService = inject(SurveyService);
  private readonly router = inject(Router);

  readonly closed = output<void>();

  protected readonly form = createSurveyForm();

  protected readonly dialogEl = viewChild.required<ElementRef<HTMLDialogElement>>('dialogEl');

  protected readonly confirmEl = viewChild.required<ElementRef<HTMLDialogElement>>('confirmEl');

  protected readonly scrollbarHover = signal(false);

  protected readonly publishing = signal(false);

  /** Set when the RPC failed; the dialog stays open so nothing typed is lost. */
  protected readonly publishError = signal<string | null>(null);

  /** Turned on by the first rejected submit and never off, so gaps stay visible. */
  protected readonly submitted = signal(false);

  /** Reactive mirror of the form status – control state alone does not notify the view. */
  private readonly status = toSignal(this.form.statusChanges, { initialValue: this.form.status });

  /** Summarises in the footer why the submit did not go through. */
  protected readonly footerError = computed(() => {
    if (this.submitted() && this.status() === 'INVALID') {
      return 'Please fill in the highlighted fields.';
    }

    return this.publishError();
  });

  protected get questions(): FormArray<QuestionForm> {
    return this.form.controls.questions;
  }

  ngAfterViewInit(): void {
    this.dialogEl().nativeElement.showModal();
  }

  protected close(): void {
    if (this.form.pristine) {
      this.dialogEl().nativeElement.close();
      return;
    }

    this.confirmEl().nativeElement.showModal();
  }

  /** Turns Escape into the discard prompt while unsaved changes exist. */
  protected onCancel(event: Event): void {
    if (this.form.pristine) {
      return;
    }

    event.preventDefault();
    this.confirmEl().nativeElement.showModal();
  }

  /** Closes the prompt and leaves the survey untouched. */
  protected keepEditing(): void {
    this.confirmEl().nativeElement.close();
  }

  /** Confirms the prompt and drops the whole survey. */
  protected discard(): void {
    this.confirmEl().nativeElement.close();
    this.dialogEl().nativeElement.close();
  }

  /** Publishes the survey via the create_survey RPC and navigates to its detail page. */
  protected async publish(): Promise<void> {
    if (this.publishing()) {
      return;
    }

    this.publishError.set(null);
    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.focusFirstInvalidField();
      return;
    }

    this.publishing.set(true);

    try {
      const { questions, ...meta } = this.form.getRawValue();
      const surveyId = await this.surveyService.createSurvey({
        ...meta,
        title: meta.title.trim(),
        description: meta.description.trim(),
        questions: questions.map((question, index) => ({
          id: question.id,
          text: question.text.trim(),
          position: index,
          allow_multiple: question.allowMultiple,
          options: question.options.map((option) => ({
            id: option.id,
            label: option.label.trim(),
          })),
        })),
      });

      this.form.markAsPristine();
      this.dialogEl().nativeElement.close();
      await this.router.navigate(['/survey', surveyId]);
    } catch {
      this.publishError.set('The survey could not be published. Please try again.');
    } finally {
      this.publishing.set(false);
    }
  }

  /** Scrolls the field that blocks publishing into view and puts the caret in it. */
  private focusFirstInvalidField(): void {
    const fieldId = firstInvalidFieldId(this.form);

    if (fieldId === null) {
      return;
    }

    const field = this.dialogEl().nativeElement.querySelector<HTMLElement>(`[id="${fieldId}"]`);
    field?.focus();
  }

  /** Appends an empty question carrying the minimum number of answer options. */
  protected addQuestion(): void {
    this.questions.push(createQuestionForm());
  }

  /** Removes a question as long as at least one remains afterwards. */
  protected removeQuestion(index: number): void {
    if (this.questions.length <= MIN_QUESTIONS) {
      return;
    }

    this.questions.removeAt(index);
  }

  /** Tracks whether the pointer sits over the scrollbar strip of the main area. */
  protected updateScrollbarHover(event: MouseEvent, el: HTMLElement): void {
    const overScrollbar =
      el.scrollHeight > el.clientHeight &&
      event.clientX - el.getBoundingClientRect().left > el.clientWidth;

    this.scrollbarHover.set(overScrollbar);
  }
}
