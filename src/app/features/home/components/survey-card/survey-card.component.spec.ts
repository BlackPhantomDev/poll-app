import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SurveyCardComponent } from './survey-card.component';

describe('SurveyCardComponent', () => {
  let component: SurveyCardComponent;
  let fixture: ComponentFixture<SurveyCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'survey-1');
    fixture.componentRef.setInput('category', 'Team Activities');
    fixture.componentRef.setInput('title', 'Test survey');
    fixture.componentRef.setInput('endDate', null);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
