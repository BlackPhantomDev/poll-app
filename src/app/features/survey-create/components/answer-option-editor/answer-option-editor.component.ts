import { Component, computed, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { IconButtonComponent } from '../../../../shared/components/icon-button/icon-button.component';
import { AnswerOptionForm } from '../../survey-create-form';

@Component({
  selector: 'app-answer-option-editor',
  imports: [ReactiveFormsModule, IconButtonComponent],
  templateUrl: './answer-option-editor.component.html',
  styleUrl: './answer-option-editor.component.scss',
})
export class AnswerOptionEditorComponent {
  readonly group = input.required<AnswerOptionForm>();
  readonly index = input.required<number>();
  readonly removed = output<void>();

  protected readonly letter = computed(() => String.fromCharCode(65 + this.index()));
}
