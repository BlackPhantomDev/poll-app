import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyMetaFormComponent } from './survey-meta-form.component';

describe('SurveyMetaFormComponent', () => {
  let component: SurveyMetaFormComponent;
  let fixture: ComponentFixture<SurveyMetaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyMetaFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyMetaFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
