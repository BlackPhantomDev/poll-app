import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { CategorySelectComponent } from './category-select.component';
import { createSurveyForm } from '../../survey-create-form';

@Component({
  imports: [ReactiveFormsModule, CategorySelectComponent],
  template: '<form [formGroup]="form"><app-category-select /></form>',
})
class TestHostComponent {
  protected readonly form = createSurveyForm();
}

describe('CategorySelectComponent', () => {
  let component: CategorySelectComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    await fixture.whenStable();
    component = fixture.debugElement.query(By.directive(CategorySelectComponent)).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
