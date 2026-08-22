import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionEditorComponent } from './question-editor.component';
import { createQuestionForm } from '../../survey-create-form';

describe('QuestionEditorComponent', () => {
  let component: QuestionEditorComponent;
  let fixture: ComponentFixture<QuestionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionEditorComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('group', createQuestionForm());
    fixture.componentRef.setInput('index', 0);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
