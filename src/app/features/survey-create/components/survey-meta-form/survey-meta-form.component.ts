import { Component, inject } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

import { CategorySelectComponent } from '../category-select/category-select.component';
import { IconButtonComponent } from '../../../../shared/components/icon-button/icon-button.component';

@Component({
  selector: 'app-survey-meta-form',
  imports: [ReactiveFormsModule, CategorySelectComponent, IconButtonComponent],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  templateUrl: './survey-meta-form.component.html',
  styleUrl: './survey-meta-form.component.scss',
})
export class SurveyMetaFormComponent {
  private readonly controlContainer = inject(ControlContainer);

  /** Resets a single meta control back to its initial value. */
  protected clear(name: 'title' | 'endDate' | 'description'): void {
    this.controlContainer.control?.get(name)?.reset();
  }
}
