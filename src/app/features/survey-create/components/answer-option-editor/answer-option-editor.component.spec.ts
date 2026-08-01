import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerOptionEditorComponent } from './answer-option-editor.component';

describe('AnswerOptionEditorComponent', () => {
  let component: AnswerOptionEditorComponent;
  let fixture: ComponentFixture<AnswerOptionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerOptionEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnswerOptionEditorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
