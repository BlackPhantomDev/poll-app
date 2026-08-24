import { inject, Service } from '@angular/core';
import { RealtimeChannel } from '@supabase/supabase-js';

import { SupabaseService } from './supabase.service';
import { optionLetter } from '../pipes/option-letter.pipe';
import { Question, QuestionResult, SurveyResponse } from '../models';

export type ResponseVotes = Pick<SurveyResponse, 'id' | 'answers'>;

@Service()
export class ResultsService {
  private readonly sb = inject(SupabaseService).client;

  /** Loads every participation of a survey; results are public, also before voting. */
  async getResponses(surveyId: string): Promise<ResponseVotes[]> {
    const { data, error } = await this.sb
      .from('responses')
      .select('id, answers')
      .eq('survey_id', surveyId);

    if (error) throw error;

    return data as ResponseVotes[];
  }

  /** Counts how often every option was picked across all participations. */
  countVotes(rows: ResponseVotes[]): Map<string, number> {
    const counts = new Map<string, number>();

    for (const row of rows) {
      for (const answer of row.answers) {
        for (const optionId of answer.option_ids) {
          counts.set(optionId, (counts.get(optionId) ?? 0) + 1);
        }
      }
    }

    return counts;
  }

  /**
   * Builds the per-question results. Percentages relate to the votes inside one
   * question, not to the number of participants, so multiple choice stays at 100 %.
   */
  buildResults(questions: Question[], counts: Map<string, number>): QuestionResult[] {
    return questions.map((question) => ({
      questionId: question.id,
      text: question.text,
      options: this.buildOptionResults(question, counts),
    }));
  }

  /** Percentages relate to the votes inside this one question, not to the participants. */
  private buildOptionResults(
    question: Question,
    counts: Map<string, number>,
  ): QuestionResult['options'] {
    const votes = question.options.map((option) => counts.get(option.id) ?? 0);
    const total = votes.reduce((sum, count) => sum + count, 0);

    return question.options.map((option, index) => ({
      label: option.label,
      letter: optionLetter(index),
      votes: votes[index],
      percent: total === 0 ? 0 : Math.round((votes[index] / total) * 100),
    }));
  }

  /** Subscribes to new participations; one participation is one row and therefore one event. */
  watchResponses(surveyId: string, onInsert: (row: ResponseVotes) => void): RealtimeChannel {
    return this.sb
      .channel(`results:${surveyId}`)
      .on<ResponseVotes>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'responses',
          filter: `survey_id=eq.${surveyId}`,
        },
        ({ new: row }) => onInsert(row),
      )
      .subscribe();
  }

  /** Ends a realtime subscription. */
  removeChannel(channel: RealtimeChannel): void {
    void this.sb.removeChannel(channel);
  }
}
