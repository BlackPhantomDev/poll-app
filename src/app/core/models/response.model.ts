export interface Answer {
  question_id: string;
  option_ids: string[];
}

export interface SurveyResponse {
  id: string;
  survey_id: string;
  answers: Answer[];
  submitted_at: string;
}
