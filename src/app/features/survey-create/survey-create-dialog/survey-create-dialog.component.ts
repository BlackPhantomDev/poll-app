import { AfterViewInit, Component, ElementRef, output, signal, viewChild } from '@angular/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';

import { QuestionEditorComponent } from '../components/question-editor/question-editor.component';
import { SurveyMetaFormComponent } from '../components/survey-meta-form/survey-meta-form.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
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
  readonly closed = output<void>();

  protected readonly form = createSurveyForm();

  protected readonly dialogEl = viewChild.required<ElementRef<HTMLDialogElement>>('dialogEl');

  protected readonly scrollbarHover = signal(false);

  protected get questions(): FormArray<QuestionForm> {
    return this.form.controls.questions;
  }

  ngAfterViewInit(): void {
    this.dialogEl().nativeElement.showModal();
  }

  protected close(): void {
    this.dialogEl().nativeElement.close();
  }

  protected publish(): void {}

  /** Tracks whether the pointer sits over the scrollbar strip of the main area. */
  protected updateScrollbarHover(event: MouseEvent, el: HTMLElement): void {
    const overScrollbar =
      el.scrollHeight > el.clientHeight &&
      event.clientX - el.getBoundingClientRect().left > el.clientWidth;

    this.scrollbarHover.set(overScrollbar);
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
}
