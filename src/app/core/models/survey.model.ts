import { CategorySlug } from '../constants/categories';
import { Question } from './question.model';

export interface Survey {
  id: string;
  title: string;
  description: string | null;
  category: CategorySlug | null;
  end_date: string | null;
  created_at: string;
  questions?: Question[];
}

export type SurveyListItem = Pick<Survey, 'id' | 'title' | 'category' | 'end_date'>;

export interface SurveyWithQuestions extends Survey {
  questions: Question[];
}
