import { Component, computed, input } from '@angular/core';

/**
 * Shows how much of a field's `maxlength` is used up. Hidden from screen readers:
 * the limit already reaches them through the `maxlength` attribute of the field.
 */
@Component({
  selector: 'app-char-counter',
  imports: [],
  template: '{{ value().length }} / {{ max() }}',
  styleUrl: './char-counter.component.scss',
  host: {
    'aria-hidden': 'true',
    '[class.char-counter--full]': 'full()',
  },
})
export class CharCounterComponent {
  /** The current field text; its length is derived so both cannot drift apart. */
  readonly value = input.required<string>();

  /** The same number the field carries as `maxlength`. */
  readonly max = input.required<number>();

  /** At this point the field stops accepting input – the counter explains why. */
  protected readonly full = computed(() => this.value().length >= this.max());
}
