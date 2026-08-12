import { AfterViewInit, Component, ElementRef, inject, output, viewChild } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';

import { AnswerOptionEditorComponent } from '../components/answer-option-editor/answer-option-editor.component';
import { CategorySelectComponent } from '../components/category-select/category-select.component';
import { QuestionEditorComponent } from '../components/question-editor/question-editor.component';
import { SurveyMetaFormComponent } from '../components/survey-meta-form/survey-meta-form.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { CategorySlug } from '../../../core/constants/categories';
import { AnswerOptionForm, MIN_OPTIONS, MIN_QUESTIONS, QuestionForm } from '../survey-create-form';

@Component({
  imports: [
    AnswerOptionEditorComponent,
    CategorySelectComponent,
    QuestionEditorComponent,
    SurveyMetaFormComponent,
    ButtonComponent,
    BadgeComponent,
  ],
  selector: 'app-survey-create-dialog',
  templateUrl: `./survey-create-dialog.component.html`,
  styleUrl: `./survey-create-dialog.component.scss`
})
export class SurveyCreateDialogComponent implements AfterViewInit {
  private readonly fb = inject(FormBuilder);

  readonly closed = output<void>();

  protected readonly form = this.fb.group({
    title: this.fb.nonNullable.control('', Validators.required),
    description: this.fb.nonNullable.control(''),
    category: this.fb.control<CategorySlug | null>(null),
    endDate: this.fb.control<string | null>(null),
    questions: this.fb.array([this.createQuestion()]),
  });

  protected readonly dialogEl = viewChild.required<ElementRef<HTMLDialogElement>>('dialogEl');

  protected get questions(): FormArray<QuestionForm> {
    return this.form.controls.questions;
  }

  ngAfterViewInit(): void {
    this.dialogEl().nativeElement.showModal();
  }

  protected close(): void {
    this.dialogEl().nativeElement.close();
  }

  protected publish(): void {

  }

  /** Appends an empty question carrying the minimum number of answer options. */
  protected addQuestion(): void {
    this.questions.push(this.createQuestion());
  }

  /** Removes a question as long as at least one remains afterwards. */
  protected removeQuestion(index: number): void {
    if (this.questions.length <= MIN_QUESTIONS) {
      return;
    }

    this.questions.removeAt(index);
  }

  private createQuestion(): QuestionForm {
    return this.fb.group({
      id: this.fb.nonNullable.control<string>(crypto.randomUUID()),
      text: this.fb.nonNullable.control('', Validators.required),
      allowMultiple: this.fb.nonNullable.control(false),
      options: this.fb.array(
        Array.from({ length: MIN_OPTIONS }, () => this.createOption()),
      ),
    });
  }

  private createOption(): AnswerOptionForm {
    return this.fb.group({
      id: this.fb.nonNullable.control<string>(crypto.randomUUID()),
      label: this.fb.nonNullable.control('', Validators.required),
    });
  }
}
