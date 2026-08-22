import { Component, computed, input } from '@angular/core';

import { OptionResult } from '../../../../core/models';

@Component({
  selector: 'app-result-bar',
  imports: [],
  templateUrl: './result-bar.component.html',
  styleUrl: './result-bar.component.scss',
})
export class ResultBarComponent {
  readonly option = input.required<OptionResult>();

  protected readonly description = computed(() => {
    const { letter, label, percent, votes } = this.option();

    return `${letter}. ${label}: ${percent} percent, ${votes} ${votes === 1 ? 'vote' : 'votes'}`;
  });
}
