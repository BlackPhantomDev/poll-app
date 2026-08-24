import { Component, computed, inject, resource, signal } from '@angular/core';

import { HeroComponent } from '../components/hero/hero.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { EndingSoonComponent } from '../components/ending-soon/ending-soon.component';
import { CategoryFilterComponent } from '../components/category-filter/category-filter.component';
import { SurveyTabsComponent, SurveyTab } from '../components/survey-tabs/survey-tabs.component';
import { CategorySlug, categoryLabel } from '../../../core/constants/categories';
import { SurveyListComponent } from '../components/survey-list/survey-list.component';
import { SurveyCardView } from '../components/survey-card/survey-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SurveyCreateDialogComponent } from '../../survey-create/survey-create-dialog/survey-create-dialog.component';
import { SurveyService } from '../../../core/services/survey.service';
import { SurveyListItem } from '../../../core/models';

function isActive(survey: SurveyListItem, now: number): boolean {
  return survey.end_date === null || new Date(survey.end_date).getTime() > now;
}

function toCardView(survey: SurveyListItem): SurveyCardView {
  return {
    id: survey.id,
    title: survey.title,
    category: categoryLabel(survey.category) ?? 'Uncategorized',
    endDate: survey.end_date,
  };
}

@Component({
  selector: 'app-home-page',
  imports: [
    HeroComponent,
    HeaderComponent,
    EndingSoonComponent,
    CategoryFilterComponent,
    SurveyTabsComponent,
    SurveyListComponent,
    EmptyStateComponent,
    LoadingSpinnerComponent,
    ButtonComponent,
    SurveyCreateDialogComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  private readonly surveyService = inject(SurveyService);

  protected readonly tab = signal<SurveyTab>('active');
  protected readonly category = signal<CategorySlug | null>(null);
  protected readonly createOpen = signal(false);

  /** Loaded once; tab and category filtering happens on this list without new requests. */
  protected readonly surveysResource = resource({
    loader: () => this.surveyService.getSurveys(),
  });

  private readonly surveys = computed(() => this.surveysResource.value() ?? []);

  protected readonly endingSoon = computed(() => {
    const now = Date.now();

    return this.surveys()
      .filter((survey) => survey.end_date !== null && new Date(survey.end_date).getTime() > now)
      .slice(0, 3)
      .map(toCardView);
  });

  protected readonly visibleSurveys = computed(() => {
    const now = Date.now();
    const tab = this.tab();
    const category = this.category();

    return this.surveys()
      .filter((survey) => isActive(survey, now) === (tab === 'active'))
      .filter((survey) => category === null || survey.category === category)
      .map(toCardView);
  });

  /**
   * Only blanks the page while there is nothing to show. A reload over an existing
   * list keeps the cards up, a retry after a failure still gets the spinner.
   */
  protected readonly loading = computed(
    () => this.surveysResource.isLoading() && !this.surveysResource.hasValue(),
  );

  protected readonly failed = computed(
    () => !this.surveysResource.isLoading() && this.surveysResource.error() !== undefined,
  );

  protected readonly endingSoonMessage = computed(() =>
    this.failed() ? 'Surveys could not be loaded.' : 'No surveys ending soon.',
  );

  protected readonly listMessage = computed(() => {
    if (this.category() !== null) {
      return 'No surveys in this category.';
    }

    return this.tab() === 'past' ? 'No past surveys yet.' : 'No active surveys yet.';
  });

  /** Picks up a survey that was just published while the overview stayed mounted. */
  protected onDialogClosed(): void {
    this.createOpen.set(false);
    this.surveysResource.reload();
  }

  protected retry(): void {
    this.surveysResource.reload();
  }
}
