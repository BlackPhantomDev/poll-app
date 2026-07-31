import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `
    <p>Seite nicht gefunden.</p>
    <a routerLink="/">Zurück zur Übersicht</a>
  `,
})
export class NotFoundPageComponent {}
