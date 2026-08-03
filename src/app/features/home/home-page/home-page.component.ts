import { Component, signal } from '@angular/core';

import { HeroComponent } from '../components/hero/hero.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { EndingSoonComponent } from '../components/ending-soon/ending-soon.component';
import { CategoryFilterComponent } from '../components/category-filter/category-filter.component';
import { SurveyTabsComponent, SurveyTab } from '../components/survey-tabs/survey-tabs.component';
import { CategorySlug } from '../../../core/constants/categories';

@Component({
  selector: 'app-home-page',
  imports: [
    HeroComponent,
    HeaderComponent,
    EndingSoonComponent,
    CategoryFilterComponent,
    SurveyTabsComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  protected readonly tab = signal<SurveyTab>('active');
  protected readonly category = signal<CategorySlug | null>(null);
}
