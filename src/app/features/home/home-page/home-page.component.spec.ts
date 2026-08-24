import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Mock, vi } from 'vitest';

import { HomePageComponent } from './home-page.component';
import { SurveyService } from '../../../core/services/survey.service';
import { CategorySlug } from '../../../core/constants/categories';
import { SurveyListItem } from '../../../core/models';

const DAY = 86_400_000;

function survey(
  id: string,
  endsInDays: number | null,
  category: CategorySlug = 'team-activities',
): SurveyListItem {
  return {
    id,
    title: `Survey ${id}`,
    category,
    end_date: endsInDays === null ? null : new Date(Date.now() + endsInDays * DAY).toISOString(),
  };
}

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let getSurveys: Mock<() => Promise<SurveyListItem[]>>;

  async function setup(result: SurveyListItem[] | Error): Promise<void> {
    getSurveys = vi.fn(() =>
      result instanceof Error ? Promise.reject(result) : Promise.resolve(result),
    );

    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [provideRouter([]), { provide: SurveyService, useValue: { getSurveys } }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  }

  function cardCount(): number {
    return fixture.nativeElement.querySelectorAll('app-survey-list app-survey-card').length;
  }

  it('should create', async () => {
    await setup([]);

    expect(component).toBeTruthy();
  });

  it('loads the list once and keeps filtering on it', async () => {
    await setup([survey('a', 2), survey('b', -2, 'health-wellness')]);
    expect(getSurveys).toHaveBeenCalledTimes(1);

    component['tab'].set('past');
    await fixture.whenStable();
    component['category'].set('health-wellness');
    await fixture.whenStable();

    expect(getSurveys).toHaveBeenCalledTimes(1);
  });

  it('splits active and past by end date', async () => {
    await setup([survey('a', 2), survey('b', -2), survey('c', null)]);

    expect(cardCount()).toBe(2);

    component['tab'].set('past');
    await fixture.whenStable();

    expect(cardCount()).toBe(1);
  });

  it('narrows the list down to one category', async () => {
    await setup([survey('a', 2), survey('b', 2, 'health-wellness')]);

    expect(cardCount()).toBe(2);

    component['category'].set('health-wellness');
    await fixture.whenStable();

    expect(cardCount()).toBe(1);
  });

  it('features three still running surveys at most', async () => {
    await setup([survey('a', 1), survey('b', 2), survey('c', 3), survey('d', 4), survey('e', -1)]);

    expect(component['endingSoon']().map((card) => card.id)).toEqual(['a', 'b', 'c']);
  });

  it('leaves surveys without an end date out of the featured row', async () => {
    await setup([survey('a', null), survey('b', 2)]);

    expect(component['endingSoon']().map((card) => card.id)).toEqual(['b']);
  });

  it('features only what ends within the next two weeks', async () => {
    await setup([survey('a', 13), survey('b', 15), survey('c', 30)]);

    expect(component['endingSoon']().map((card) => card.id)).toEqual(['a']);
  });

  it('says so when nothing is ending soon', async () => {
    await setup([survey('a', 30), survey('b', null)]);

    expect(component['endingSoon']()).toEqual([]);
    expect(component['endingSoonMessage']()).toBe('No surveys ending soon.');
  });

  it('explains an empty category instead of claiming there are no surveys', async () => {
    await setup([survey('a', 2)]);
    component['category'].set('health-wellness');
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
    expect(component['listMessage']()).toBe('No surveys in this category.');
  });

  it('offers a retry after a failed load', async () => {
    await setup(new Error('offline'));

    expect(fixture.nativeElement.querySelector('.home-page__error')).toBeTruthy();

    getSurveys.mockResolvedValue([survey('a', 2)]);
    fixture.nativeElement.querySelector('.home-page__error button').click();
    await fixture.whenStable();

    expect(getSurveys).toHaveBeenCalledTimes(2);
    expect(cardCount()).toBe(1);
  });
});
