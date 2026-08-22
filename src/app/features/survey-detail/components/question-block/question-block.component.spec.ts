import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionBlockComponent } from './question-block.component';
import { Question } from '../../../../core/models';

const question: Question = {
  id: 'question-1',
  survey_id: 'survey-1',
  text: 'Test question?',
  position: 0,
  allow_multiple: false,
  options: [
    { id: 'option-1', label: 'First' },
    { id: 'option-2', label: 'Second' },
  ],
};

describe('QuestionBlockComponent', () => {
  let component: QuestionBlockComponent;
  let fixture: ComponentFixture<QuestionBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionBlockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionBlockComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('question', question);
    fixture.componentRef.setInput('index', 0);
    fixture.componentRef.setInput('selected', []);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
