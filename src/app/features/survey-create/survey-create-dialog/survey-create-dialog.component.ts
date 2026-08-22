import { AfterViewInit, Component, ElementRef, inject, output, signal, viewChild } from '@angular/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { QuestionEditorComponent } from '../components/question-editor/question-editor.component';
import { SurveyMetaFormComponent } from '../components/survey-meta-form/survey-meta-form.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { SurveyService } from '../../../core/services/survey.service';
import { createQuestionForm, createSurveyForm, MIN_QUESTIONS, QuestionForm } from '../survey-create-form';

@Component({
  imports: [
    ReactiveFormsModule,
    QuestionEditorComponent,
    SurveyMetaFormComponent,
    ButtonComponent,
    BadgeComponent,
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
    if (this.form.invalid || this.publishing()) {
      this.form.markAllAsTouched();
      return;
    }

    this.publishing.set(true);

    try {
      const { questions, ...meta } = this.form.getRawValue();
      const surveyId = await this.surveyService.createSurvey({
        ...meta,
        questions: questions.map((question, index) => ({
          id: question.id,
          text: question.text,
          position: index,
          allow_multiple: question.allowMultiple,
          options: question.options,
        })),
      });

      this.form.markAsPristine();
      this.dialogEl().nativeElement.close();
      await this.router.navigate(['/survey', surveyId]);
    } finally {
      this.publishing.set(false);
    }
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
