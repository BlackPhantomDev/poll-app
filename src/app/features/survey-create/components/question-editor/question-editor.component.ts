import { Component, input, output } from '@angular/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';

import { AnswerOptionEditorComponent } from '../answer-option-editor/answer-option-editor.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { IconButtonComponent } from '../../../../shared/components/icon-button/icon-button.component';
import { AnswerOptionForm, createAnswerOptionForm, MAX_QUESTION_LENGTH, MIN_OPTIONS, QuestionForm } from '../../survey-create-form';

@Component({
  selector: 'app-question-editor',
  imports: [ReactiveFormsModule, AnswerOptionEditorComponent, ButtonComponent, IconButtonComponent],
  templateUrl: './question-editor.component.html',
  styleUrl: './question-editor.component.scss',
})
export class QuestionEditorComponent {
  readonly group = input.required<QuestionForm>();
  readonly index = input.required<number>();
  readonly removed = output<void>();

  protected readonly maxQuestion = MAX_QUESTION_LENGTH;

  protected get options(): FormArray<AnswerOptionForm> {
    return this.group().controls.options;
  }

  /** Appends an empty answer option to this question. */
  protected addOption(): void {
    this.options.push(createAnswerOptionForm());
  }

  /** Removes an answer option as long as the minimum count is kept. */
  protected removeOption(index: number): void {
    if (this.options.length <= MIN_OPTIONS) {
      return;
    }

    this.options.removeAt(index);
  }
}
