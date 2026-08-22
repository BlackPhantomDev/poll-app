import { TestBed } from '@angular/core/testing';

import { ResultsService, ResponseVotes } from './results.service';
import { Question } from '../models';

function question(id: string, optionIds: string[]): Question {
  return {
    id,
    survey_id: 'survey-1',
    text: `Question ${id}`,
    position: 0,
    allow_multiple: true,
    options: optionIds.map((optionId) => ({ id: optionId, label: `Label ${optionId}` })),
  };
}

describe('ResultsService', () => {
  let service: ResultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultsService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('counts every picked option across all participations', () => {
    const rows: ResponseVotes[] = [
      { id: 'r1', answers: [{ question_id: 'q1', option_ids: ['a', 'b'] }] },
      { id: 'r2', answers: [{ question_id: 'q1', option_ids: ['a'] }] },
    ];

    const counts = service.countVotes(rows);

    expect(counts.get('a')).toBe(2);
    expect(counts.get('b')).toBe(1);
    expect(counts.has('c')).toBe(false);
  });

  it('relates percentages to the votes inside one question', () => {
    const counts = new Map([
      ['a', 3],
      ['b', 1],
    ]);

    const [result] = service.buildResults([question('q1', ['a', 'b'])], counts);

    expect(result.options.map((option) => option.percent)).toEqual([75, 25]);
    expect(result.options.map((option) => option.letter)).toEqual(['A', 'B']);
  });

  it('stays below 100 percent per question when multiple choice is allowed', () => {
    const rows: ResponseVotes[] = [
      { id: 'r1', answers: [{ question_id: 'q1', option_ids: ['a', 'b'] }] },
      { id: 'r2', answers: [{ question_id: 'q1', option_ids: ['a', 'b'] }] },
    ];

    const [result] = service.buildResults([question('q1', ['a', 'b'])], service.countVotes(rows));

    expect(result.options.map((option) => option.percent)).toEqual([50, 50]);
  });

  it('reports zero percent instead of NaN for a survey without answers', () => {
    const [result] = service.buildResults([question('q1', ['a', 'b'])], new Map());

    expect(result.options.map((option) => option.percent)).toEqual([0, 0]);
    expect(result.options.map((option) => option.votes)).toEqual([0, 0]);
  });
});
