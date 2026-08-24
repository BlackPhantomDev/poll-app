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

export const SURVEY_TITLE_FIELD_ID = 'survey-name';

export const SURVEY_CATEGORY_FIELD_ID = 'survey-category';

/** The group id is a UUID, so the field id stays unique across questions. */
export function questionTextFieldId(question: QuestionForm): string {
  return `question-text-${question.controls.id.value}`;
}

/** The group id is a UUID, so the field id stays unique across options. */
export function answerOptionFieldId(option: AnswerOptionForm): string {
  return `answer-option-${option.controls.id.value}`;
}

/** The message belonging to a field is wired to it through `aria-describedby`. */
export function fieldErrorId(fieldId: string): string {
  return `${fieldId}-error`;
}

/** A field stays quiet until the user has left it or tried to publish. */
export function showFieldError(control: AbstractControl, submitted: boolean): boolean {
  return control.invalid && (control.touched || submitted);
}

/** The field a rejected submit should jump to, in reading order. */
export function firstInvalidFieldId(form: SurveyCreateForm): string | null {
  if (form.controls.title.invalid) {
    return SURVEY_TITLE_FIELD_ID;
  }

  if (form.controls.category.invalid) {
    return SURVEY_CATEGORY_FIELD_ID;
  }

  return (
    form.controls.questions.controls
      .map((question) => firstInvalidQuestionFieldId(question))
      .find((fieldId) => fieldId !== null) ?? null
  );
}

/** The first gap inside one question, its own text before its answer options. */
function firstInvalidQuestionFieldId(question: QuestionForm): string | null {
  if (question.controls.text.invalid) {
    return questionTextFieldId(question);
  }

  const option = question.controls.options.controls.find(
    (candidate) => candidate.controls.label.invalid,
  );

  return option === undefined ? null : answerOptionFieldId(option);
}

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

/** Builds an empty create form; it already carries the one question that is required. */
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

/**
 * Builds a question with the minimum number of options. The id is created here and
 * not on save, so the option_ids stored in a response always point somewhere.
 */
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

/** Builds an empty answer option; like a question it gets its id right away. */
export function createAnswerOptionForm(): AnswerOptionForm {
  return new FormGroup({
    id: new FormControl<string>(crypto.randomUUID(), { nonNullable: true }),
    label: new FormControl('', {
      nonNullable: true,
      validators: [nonBlank, Validators.maxLength(MAX_OPTION_LENGTH)],
    }),
  });
}
