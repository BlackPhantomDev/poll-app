import { inject, Service } from '@angular/core';

import { SupabaseService } from './supabase.service';
import { Answer } from '../models';

@Service()
export class ResponseService {
  private readonly sb = inject(SupabaseService).client;

  /** Writes one participation as a single row into responses. */
  async submitResponse(surveyId: string, answers: Answer[]): Promise<void> {
    const { error } = await this.sb
      .from('responses')
      .insert({ survey_id: surveyId, answers });

    if (error) throw error;
  }

  /** True when this browser already voted on the survey. */
  hasVoted(surveyId: string): boolean {
    return localStorage.getItem(this.votedKey(surveyId)) !== null;
  }

  /** Remembers a submitted participation so reloads keep the form disabled. */
  markVoted(surveyId: string): void {
    localStorage.setItem(this.votedKey(surveyId), new Date().toISOString());
  }

  private votedKey(surveyId: string): string {
    return `voted:${surveyId}`;
  }
}
