import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyHeaderComponent } from './survey-header.component';
import { Survey } from '../../../../core/models';

const survey: Survey = {
  id: 'survey-1',
  title: 'Test survey',
  description: null,
  category: null,
  end_date: null,
  created_at: '2026-01-01T00:00:00Z',
};

describe('SurveyHeaderComponent', () => {
  let component: SurveyHeaderComponent;
  let fixture: ComponentFixture<SurveyHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyHeaderComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('survey', survey);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
