import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

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

export function createSurveyForm(): SurveyCreateForm {
  return new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: Validators.required }),
    description: new FormControl('', { nonNullable: true }),
    category: new FormControl<CategorySlug | null>(null),
    endDate: new FormControl<string | null>(null),
    questions: new FormArray([createQuestionForm()]),
  });
}

export function createQuestionForm(): QuestionForm {
  return new FormGroup({
    id: new FormControl<string>(crypto.randomUUID(), { nonNullable: true }),
    text: new FormControl('', { nonNullable: true, validators: Validators.required }),
    allowMultiple: new FormControl(false, { nonNullable: true }),
    options: new FormArray(
      Array.from({ length: MIN_OPTIONS }, () => createAnswerOptionForm()),
    ),
  });
}

export function createAnswerOptionForm(): AnswerOptionForm {
  return new FormGroup({
    id: new FormControl<string>(crypto.randomUUID(), { nonNullable: true }),
    label: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });
}
