import { AfterViewInit, Component, ElementRef, output, viewChild } from '@angular/core';

import { AnswerOptionEditorComponent } from '../components/answer-option-editor/answer-option-editor.component';
import { CategorySelectComponent } from '../components/category-select/category-select.component';
import { QuestionEditorComponent } from '../components/question-editor/question-editor.component';
import { SurveyMetaFormComponent } from '../components/survey-meta-form/survey-meta-form.component';

@Component({
  selector: 'app-survey-create-dialog',
  templateUrl: `./survey-create-dialog.component.html`,
  styleUrl: `./survey-create-dialog.component.scss`
})
export class SurveyCreateDialogComponent implements AfterViewInit {
  readonly closed = output<void>();

  protected readonly dialogEl = viewChild.required<ElementRef<HTMLDialogElement>>('dialogEl');

  ngAfterViewInit(): void {
    this.dialogEl().nativeElement.showModal();
  }

  protected close(): void {
    this.dialogEl().nativeElement.close();
  }
}