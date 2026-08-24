import { EndsInPipe } from './ends-in.pipe';

const DAY_IN_MS = 86_400_000;

function inDays(days: number): string {
  return new Date(Date.now() + days * DAY_IN_MS).toISOString();
}

describe('EndsInPipe', () => {
  let pipe: EndsInPipe;

  beforeEach(() => {
    pipe = new EndsInPipe();
  });

  it('marks a survey without an end date as open ended', () => {
    expect(pipe.transform(null)).toBe('No end date');
  });

  it('names the day a survey ended on', () => {
    expect(pipe.transform('2026-03-07T10:00:00.000Z')).toBe('Ended 07.03.2026');
  });

  it('pads day and month to a fixed width', () => {
    expect(pipe.transform('2025-11-04T10:00:00.000Z')).toBe('Ended 04.11.2025');
  });

  it('counts a part day as the last day', () => {
    expect(pipe.transform(inDays(0.5))).toBe('Ends in 1 day');
  });

  it('rounds up to whole days beyond the last one', () => {
    expect(pipe.transform(inDays(2.5))).toBe('Ends in 3 days');
  });
});
