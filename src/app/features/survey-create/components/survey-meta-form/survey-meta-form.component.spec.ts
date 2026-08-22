import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SurveyMetaFormComponent } from './survey-meta-form.component';
import { createSurveyForm } from '../../survey-create-form';

@Component({
  imports: [ReactiveFormsModule, SurveyMetaFormComponent],
  template: '<form [formGroup]="form"><app-survey-meta-form /></form>',
})
class TestHostComponent {
  protected readonly form = createSurveyForm();
}

describe('SurveyMetaFormComponent', () => {
  let component: SurveyMetaFormComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    await fixture.whenStable();
    component = fixture.debugElement.query(By.directive(SurveyMetaFormComponent)).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
