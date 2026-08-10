import { Routes } from '@angular/router';

import { HomePageComponent } from './features/home/home-page/home-page.component';
import { NotFoundPageComponent } from './features/not-found/not-found-page/not-found-page.component';
import { SurveyCreateDialogComponent } from './features/survey-create/survey-create-dialog/survey-create-dialog.component';
import { SurveyDetailPageComponent } from './features/survey-detail/survey-detail-page/survey-detail-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'survey/:id', component: SurveyDetailPageComponent },
  { path: '**', component: NotFoundPageComponent },
];
