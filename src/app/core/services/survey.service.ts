import { inject, Service } from '@angular/core';

import { SupabaseService } from './supabase.service';
import { AnswerOption, SurveyWithQuestions } from '../models';
import { CategorySlug } from '../constants/categories';

export interface CreateSurveyQuestion {
  id: string;
  text: string;
  position: number;
  allow_multiple: boolean;
  options: AnswerOption[];
}

export interface CreateSurveyInput {
  title: string;
  description: string;
  category: CategorySlug | null;
  endDate: string | null;
  questions: CreateSurveyQuestion[];
}

@Service()
export class SurveyService {
  private readonly sb = inject(SupabaseService).client;

  /** Creates a survey with its questions in one transaction and returns the new survey id. */
  async createSurvey(input: CreateSurveyInput): Promise<string> {
    const { data, error } = await this.sb.rpc('create_survey', {
      p_title: input.title,
      p_description: input.description,
      p_category: input.category,
      p_end_date: input.endDate,
      p_questions: input.questions,
    });

    if (error) throw error;

    return data as string;
  }

  /** Loads one survey including its questions, ordered by position, in a single request. */
  async getSurvey(id: string): Promise<SurveyWithQuestions> {
    const { data, error } = await this.sb
      .from('surveys')
      .select('*, questions(*)')
      .eq('id', id)
      .order('position', { referencedTable: 'questions' })
      .single();

    if (error) throw error;

    return data as SurveyWithQuestions;
  }
}
