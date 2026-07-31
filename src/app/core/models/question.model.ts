export interface AnswerOption {
  id: string;
  label: string;
}

export interface Question {
  id: string;
  survey_id: string;
  text: string;
  position: number;
  allow_multiple: boolean;
  options: AnswerOption[];
}
