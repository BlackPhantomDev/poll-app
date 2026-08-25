import { createSurveyForm, todayAsIsoDate } from './survey-create-form';

/** Shifts today by whole days and returns it in the `YYYY-MM-DD` format of the field. */
function isoDateInDays(days: number): string {
  const date = new Date(`${todayAsIsoDate()}T00:00:00`);
  date.setDate(date.getDate() + days);

  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

describe('createSurveyForm end date', () => {
  it('stays valid without an end date', () => {
    const form = createSurveyForm();

    expect(form.controls.endDate.valid).toBe(true);
  });

  it('rejects a date that already passed', () => {
    const form = createSurveyForm();

    form.controls.endDate.setValue(isoDateInDays(-1));

    expect(form.controls.endDate.hasError('endDateInPast')).toBe(true);
  });

  it('accepts today, since the survey runs until midnight', () => {
    const form = createSurveyForm();

    form.controls.endDate.setValue(todayAsIsoDate());

    expect(form.controls.endDate.valid).toBe(true);
  });

  it('accepts a date in the future', () => {
    const form = createSurveyForm();

    form.controls.endDate.setValue(isoDateInDays(14));

    expect(form.controls.endDate.valid).toBe(true);
  });
});
