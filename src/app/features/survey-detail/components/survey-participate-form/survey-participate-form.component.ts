import { Component, computed, input, output, signal } from '@angular/core';

import { QuestionBlockComponent } from '../question-block/question-block.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Answer, Question } from '../../../../core/models';

@Component({
  selector: 'app-survey-participate-form',
  imports: [QuestionBlockComponent, ButtonComponent],
  templateUrl: './survey-participate-form.component.html',
  styleUrl: './survey-participate-form.component.scss',
})
export class SurveyParticipateFormComponent {
  readonly questions = input.required<Question[]>();
  readonly disabled = input(false);
  /** Explains why the form is locked; nothing is shown while participation is open. */
  readonly notice = input<string | null>(null);
  /** Reports a failed submit; takes the notice slot because the form is open again. */
  readonly error = input<string | null>(null);

  readonly submitted = output<Answer[]>();

  /** Fires on every pick so the results can show the own vote before it is stored. */
  readonly selectionChanged = output<Answer[]>();

  protected readonly selections = signal<Record<string, string[]>>({});

  protected readonly complete = computed(() =>
    this.questions().every((question) => (this.selections()[question.id] ?? []).length > 0),
  );

  /** Toggles a checkbox option; radio questions replace their single pick. */
  protected toggleOption(question: Question, optionId: string): void {
    this.selections.update((current) => {
      const selected = current[question.id] ?? [];

      if (!question.allow_multiple) {
        return { ...current, [question.id]: [optionId] };
      }

      const next = selected.includes(optionId)
        ? selected.filter((id) => id !== optionId)
        : [...selected, optionId];

      return { ...current, [question.id]: next };
    });

    this.selectionChanged.emit(this.toAnswers());
  }

  /** Emits one answer per question once every question has at least one pick. */
  protected submit(): void {
    if (!this.complete() || this.disabled()) {
      return;
    }

    this.submitted.emit(this.toAnswers());
  }

  /** One answer per question in display order; a question without a pick stays empty. */
  private toAnswers(): Answer[] {
    return this.questions().map((question) => ({
      question_id: question.id,
      option_ids: this.selections()[question.id] ?? [],
    }));
  }
}
