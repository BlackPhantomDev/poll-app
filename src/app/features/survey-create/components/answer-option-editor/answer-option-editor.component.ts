import { Component, computed, input, output } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

import { CharCounterComponent } from '../../../../shared/components/char-counter/char-counter.component';
import { IconButtonComponent } from '../../../../shared/components/icon-button/icon-button.component';
import { OptionLetterPipe } from '../../../../core/pipes/option-letter.pipe';
import {
  AnswerOptionForm,
  answerOptionFieldId,
  fieldErrorId,
  MAX_OPTION_LENGTH,
  showFieldError,
} from '../../survey-create-form';

@Component({
  selector: 'app-answer-option-editor',
  imports: [ReactiveFormsModule, IconButtonComponent, OptionLetterPipe, CharCounterComponent],
  templateUrl: './answer-option-editor.component.html',
  styleUrl: './answer-option-editor.component.scss',
})
export class AnswerOptionEditorComponent {
  readonly group = input.required<AnswerOptionForm>();
  readonly index = input.required<number>();

  /** Reveals the messages of fields the user never touched, after a rejected submit. */
  readonly submitted = input(false);

  readonly removed = output<void>();

  protected readonly maxOption = MAX_OPTION_LENGTH;

  protected readonly inputId = computed(() => answerOptionFieldId(this.group()));

  protected readonly errorId = computed(() => fieldErrorId(this.inputId()));

  /** The answer text; named apart from the icon button's own `label` input. */
  protected get labelControl(): AbstractControl<string> {
    return this.group().controls.label;
  }

  /** True once the field is both invalid and worth complaining about. */
  protected showError(control: AbstractControl): boolean {
    return showFieldError(control, this.submitted());
  }
}
