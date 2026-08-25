import { Component, computed, input, output } from '@angular/core';
import { AbstractControl, FormArray, ReactiveFormsModule } from '@angular/forms';

import { AnswerOptionEditorComponent } from '../answer-option-editor/answer-option-editor.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CharCounterComponent } from '../../../../shared/components/char-counter/char-counter.component';
import { IconButtonComponent } from '../../../../shared/components/icon-button/icon-button.component';
import {
  AnswerOptionForm,
  createAnswerOptionForm,
  fieldErrorId,
  MAX_QUESTION_LENGTH,
  MIN_OPTIONS,
  QuestionForm,
  questionTextFieldId,
  showFieldError,
} from '../../survey-create-form';

@Component({
  selector: 'app-question-editor',
  imports: [
    ReactiveFormsModule,
    AnswerOptionEditorComponent,
    ButtonComponent,
    IconButtonComponent,
    CharCounterComponent,
  ],
  templateUrl: './question-editor.component.html',
  styleUrl: './question-editor.component.scss',
})
export class QuestionEditorComponent {
  readonly group = input.required<QuestionForm>();
  readonly index = input.required<number>();

  /** Reveals the messages of fields the user never touched, after a rejected submit. */
  readonly submitted = input(false);

  readonly removed = output<void>();

  protected readonly maxQuestion = MAX_QUESTION_LENGTH;

  protected readonly textId = computed(() => questionTextFieldId(this.group()));

  protected readonly textErrorId = computed(() => fieldErrorId(this.textId()));

  /** The question wording itself. */
  protected get text(): AbstractControl<string> {
    return this.group().controls.text;
  }

  /** The answer options in display order. */
  protected get options(): FormArray<AnswerOptionForm> {
    return this.group().controls.options;
  }

  /** True once the field is both invalid and worth complaining about. */
  protected showError(control: AbstractControl): boolean {
    return showFieldError(control, this.submitted());
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
