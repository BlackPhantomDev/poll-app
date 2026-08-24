import { Component, inject, input } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

import { CategorySelectComponent } from '../category-select/category-select.component';
import { IconButtonComponent } from '../../../../shared/components/icon-button/icon-button.component';
import {
  fieldErrorId,
  MAX_DESCRIPTION_LENGTH,
  MAX_TITLE_LENGTH,
  showFieldError,
  SURVEY_TITLE_FIELD_ID,
  SurveyCreateForm,
} from '../../survey-create-form';

@Component({
  selector: 'app-survey-meta-form',
  imports: [ReactiveFormsModule, CategorySelectComponent, IconButtonComponent],
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

  /** The dialog binds the survey form to the enclosing `<form>`, so the cast holds. */
  private get form(): SurveyCreateForm {
    return this.controlContainer.control as SurveyCreateForm;
  }

  protected get title(): AbstractControl<string> {
    return this.form.controls.title;
  }

  protected showError(control: AbstractControl): boolean {
    return showFieldError(control, this.submitted());
  }

  /** Resets a single meta control back to its initial value. */
  protected clear(name: 'title' | 'endDate' | 'description'): void {
    this.form.get(name)?.reset();
  }
}
