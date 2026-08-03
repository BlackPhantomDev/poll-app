import { Component, input, output } from '@angular/core';

export type SurveyTab = 'active' | 'past';

@Component({
  selector: 'app-survey-tabs',
  imports: [],
  templateUrl: './survey-tabs.component.html',
  styleUrl: './survey-tabs.component.scss',
  host: {
    role: 'group',
    'aria-label': 'Filter surveys by status',
  },
})
export class SurveyTabsComponent {
  readonly active = input<SurveyTab>('active');
  readonly activeChange = output<SurveyTab>();

  protected readonly tabs: readonly { id: SurveyTab; label: string }[] = [
    { id: 'active', label: 'Active survey' },
    { id: 'past', label: 'Past survey' },
  ];
}
