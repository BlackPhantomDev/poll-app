import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { CategorySlug } from '../../core/constants/categories';

export type AnswerOptionForm = FormGroup<{
  id: FormControl<string>;
  label: FormControl<string>;
}>;

export type QuestionForm = FormGroup<{
  id: FormControl<string>;
  text: FormControl<string>;
  allowMultiple: FormControl<boolean>;
  options: FormArray<AnswerOptionForm>;
}>;

export type SurveyCreateForm = FormGroup<{
  title: FormControl<string>;
  description: FormControl<string>;
  category: FormControl<CategorySlug | null>;
  endDate: FormControl<string | null>;
  questions: FormArray<QuestionForm>;
}>;

export const MIN_QUESTIONS = 1;

export const MIN_OPTIONS = 2;
