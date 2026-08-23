import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { CATEGORIES, CategorySlug } from '../../core/constants/categories';

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

export const MAX_TITLE_LENGTH = 200;

export const MAX_DESCRIPTION_LENGTH = 2000;

export const MAX_QUESTION_LENGTH = 300;

export const MAX_OPTION_LENGTH = 200;

/** `Validators.required` accepts "   ", which would store a blank title as valid. */
function nonBlank(control: AbstractControl<string>): ValidationErrors | null {
  return control.value.trim().length > 0 ? null : { required: true };
}

/** The select can only offer known slugs; this keeps a tampered value out of the payload. */
function knownCategory(control: AbstractControl<CategorySlug | null>): ValidationErrors | null {
  const value = control.value;

  return value === null || CATEGORIES.some((category) => category.slug === value)
    ? null
    : { unknownCategory: true };
}

export function createSurveyForm(): SurveyCreateForm {
  return new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [nonBlank, Validators.maxLength(MAX_TITLE_LENGTH)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: Validators.maxLength(MAX_DESCRIPTION_LENGTH),
    }),
    category: new FormControl<CategorySlug | null>(null, { validators: knownCategory }),
    endDate: new FormControl<string | null>(null),
    questions: new FormArray([createQuestionForm()]),
  });
}

export function createQuestionForm(): QuestionForm {
  return new FormGroup({
    id: new FormControl<string>(crypto.randomUUID(), { nonNullable: true }),
    text: new FormControl('', {
      nonNullable: true,
      validators: [nonBlank, Validators.maxLength(MAX_QUESTION_LENGTH)],
    }),
    allowMultiple: new FormControl(false, { nonNullable: true }),
    options: new FormArray(
      Array.from({ length: MIN_OPTIONS }, () => createAnswerOptionForm()),
    ),
  });
}

export function createAnswerOptionForm(): AnswerOptionForm {
  return new FormGroup({
    id: new FormControl<string>(crypto.randomUUID(), { nonNullable: true }),
    label: new FormControl('', {
      nonNullable: true,
      validators: [nonBlank, Validators.maxLength(MAX_OPTION_LENGTH)],
    }),
  });
}
