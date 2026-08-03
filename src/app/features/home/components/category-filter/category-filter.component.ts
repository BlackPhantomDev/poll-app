import { Component, input, output } from '@angular/core';

import { CATEGORIES, CategorySlug } from '../../../../core/constants/categories';

@Component({
  selector: 'app-category-filter',
  imports: [],
  templateUrl: './category-filter.component.html',
  styleUrl: './category-filter.component.scss',
})
export class CategoryFilterComponent {
  /** `null` = keine Kategorie gewählt, es wird nicht gefiltert. */
  readonly selected = input<CategorySlug | null>(null);
  readonly selectedChange = output<CategorySlug | null>();

  protected readonly categories = CATEGORIES;

  protected onChange(event: Event): void {
    const { value } = event.target as HTMLSelectElement;

    this.selectedChange.emit(value === '' ? null : (value as CategorySlug));
  }
}
