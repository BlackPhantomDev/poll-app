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

  it('marks a passed end date as ended', () => {
    expect(pipe.transform(inDays(-1))).toBe('Ended');
  });

  it('counts a part day as the last day', () => {
    expect(pipe.transform(inDays(0.5))).toBe('Ends in 1 day');
  });

  it('rounds up to whole days beyond the last one', () => {
    expect(pipe.transform(inDays(2.5))).toBe('Ends in 3 days');
  });
});
