export interface OptionResult {
  label: string;
  letter: string;
  votes: number;
  percent: number;
}

export interface QuestionResult {
  questionId: string;
  text: string;
  options: OptionResult[];
}
