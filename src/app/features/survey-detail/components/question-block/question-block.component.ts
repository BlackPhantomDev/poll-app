import { Component, input, output } from '@angular/core';

import { OptionLetterPipe } from '../../../../core/pipes/option-letter.pipe';
import { Question } from '../../../../core/models';

@Component({
  selector: 'app-question-block',
  imports: [OptionLetterPipe],
  templateUrl: './question-block.component.html',
  styleUrl: './question-block.component.scss',
})
export class QuestionBlockComponent {
  readonly question = input.required<Question>();
  readonly index = input.required<number>();
  readonly selected = input.required<string[]>();
  readonly disabled = input(false);

  readonly optionToggled = output<string>();
}
