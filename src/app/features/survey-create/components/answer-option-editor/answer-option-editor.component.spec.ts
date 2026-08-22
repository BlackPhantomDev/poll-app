import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerOptionEditorComponent } from './answer-option-editor.component';
import { createAnswerOptionForm } from '../../survey-create-form';

describe('AnswerOptionEditorComponent', () => {
  let component: AnswerOptionEditorComponent;
  let fixture: ComponentFixture<AnswerOptionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerOptionEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnswerOptionEditorComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('group', createAnswerOptionForm());
    fixture.componentRef.setInput('index', 0);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
