import { Component, input } from '@angular/core';

import { QuestionForm } from '../../survey-create-form';

@Component({
  selector: 'app-question-editor',
  imports: [],
  templateUrl: './question-editor.component.html',
  styleUrl: './question-editor.component.scss',
})
export class QuestionEditorComponent {
  readonly group = input.required<QuestionForm>();
}
