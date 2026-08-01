import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyParticipateFormComponent } from './survey-participate-form.component';

describe('SurveyParticipateFormComponent', () => {
  let component: SurveyParticipateFormComponent;
  let fixture: ComponentFixture<SurveyParticipateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyParticipateFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyParticipateFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
