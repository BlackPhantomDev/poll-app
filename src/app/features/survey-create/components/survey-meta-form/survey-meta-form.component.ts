import { Component, inject, input } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

import { CategorySelectComponent } from '../category-select/category-select.component';
import { CharCounterComponent } from '../../../../shared/components/char-counter/char-counter.component';
import { IconButtonComponent } from '../../../../shared/components/icon-button/icon-button.component';
import {
  fieldErrorId,
  MAX_DESCRIPTION_LENGTH,
  MAX_TITLE_LENGTH,
  showFieldError,
  SURVEY_END_DATE_FIELD_ID,
  SURVEY_TITLE_FIELD_ID,
  SurveyCreateForm,
  todayAsIsoDate,
} from '../../survey-create-form';

@Component({
  selector: 'app-survey-meta-form',
  imports: [ReactiveFormsModule, CategorySelectComponent, IconButtonComponent, CharCounterComponent],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  templateUrl: './survey-meta-form.component.html',
  styleUrl: './survey-meta-form.component.scss',
})
export class SurveyMetaFormComponent {
  private readonly controlContainer = inject(ControlContainer);

  /** Reveals the messages of fields the user never touched, after a rejected submit. */
  readonly submitted = input(false);

  protected readonly maxTitle = MAX_TITLE_LENGTH;
  protected readonly maxDescription = MAX_DESCRIPTION_LENGTH;
  protected readonly titleId = SURVEY_TITLE_FIELD_ID;
  protected readonly titleErrorId = fieldErrorId(SURVEY_TITLE_FIELD_ID);
  protected readonly endDateId = SURVEY_END_DATE_FIELD_ID;
  protected readonly endDateErrorId = fieldErrorId(SURVEY_END_DATE_FIELD_ID);

  /** Read once per opened dialog; a survey is not filled in across midnight. */
  protected readonly today = todayAsIsoDate();

  /** The dialog binds the survey form to the enclosing `<form>`, so the cast holds. */
  private get form(): SurveyCreateForm {
    return this.controlContainer.control as SurveyCreateForm;
  }

  /** The only required field in this block; the rest is optional. */
  protected get title(): AbstractControl<string> {
    return this.form.controls.title;
  }

  /** Optional free text; only its length is capped. */
  protected get description(): AbstractControl<string> {
    return this.form.controls.description;
  }

  /** Optional, but a date that already passed would close the survey before it opens. */
  protected get endDate(): AbstractControl<string | null> {
    return this.form.controls.endDate;
  }

  /** True once the field is both invalid and worth complaining about. */
  protected showError(control: AbstractControl): boolean {
    return showFieldError(control, this.submitted());
  }

  /** Resets a single meta control back to its initial value. */
  protected clear(name: 'title' | 'endDate' | 'description'): void {
    this.form.get(name)?.reset();
  }
}
