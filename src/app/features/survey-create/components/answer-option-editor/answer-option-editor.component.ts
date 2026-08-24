import { Component, computed, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { IconButtonComponent } from '../../../../shared/components/icon-button/icon-button.component';
import { OptionLetterPipe } from '../../../../core/pipes/option-letter.pipe';
import { AnswerOptionForm, MAX_OPTION_LENGTH } from '../../survey-create-form';

@Component({
  selector: 'app-answer-option-editor',
  imports: [ReactiveFormsModule, IconButtonComponent, OptionLetterPipe],
  templateUrl: './answer-option-editor.component.html',
  styleUrl: './answer-option-editor.component.scss',
})
export class AnswerOptionEditorComponent {
  readonly group = input.required<AnswerOptionForm>();
  readonly index = input.required<number>();
  readonly removed = output<void>();

  protected readonly maxOption = MAX_OPTION_LENGTH;

  /** The form group id is a UUID, so it keeps the label unique across options. */
  protected readonly inputId = computed(() => `answer-option-${this.group().controls.id.value}`);
}
