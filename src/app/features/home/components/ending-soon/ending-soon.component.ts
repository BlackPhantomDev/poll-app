import { Component } from '@angular/core';
import { SurveyCardComponent } from '../survey-card/survey-card.component';
import { MOCK_SURVEYS } from '../../../../core/mocks/surveys.mock';
import { categoryLabel } from '../../../../core/constants/categories';
import { SurveyWithQuestions } from '../../../../core/models';

type DatedSurvey = SurveyWithQuestions & { end_date: string };

function formatEndsIn(endDate: string): string {
  const days = Math.ceil((new Date(endDate).getTime() - Date.now()) / 86_400_000);

  if (days <= 0) {
    return 'Ended';
  }

  return days === 1 ? 'Ends in 1 day' : `Ends in ${days} days`;
}

@Component({
  selector: 'app-ending-soon',
  imports: [SurveyCardComponent],
  templateUrl: './ending-soon.component.html',
  styleUrl: './ending-soon.component.scss',
})
export class EndingSoonComponent {
  protected readonly surveys = MOCK_SURVEYS.filter(
    (survey): survey is DatedSurvey => survey.end_date !== null,
  )
    .sort((a, b) => a.end_date.localeCompare(b.end_date))
    .slice(0, 3)
    .map((survey) => ({
      id: survey.id,
      title: survey.title,
      category: categoryLabel(survey.category) ?? 'Uncategorized',
      endsIn: formatEndsIn(survey.end_date),
    }));
}
