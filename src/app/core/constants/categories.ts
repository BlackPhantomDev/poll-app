export const CATEGORIES = [
  { slug: 'team-activities', label: 'Team Activities' },
  { slug: 'health-wellness', label: 'Health & Wellness' },
  { slug: 'gaming-entertainment', label: 'Gaming & Entertainment' },
  { slug: 'education-learning', label: 'Education & Learning' },
  { slug: 'lifestyle-preferences', label: 'Lifestyle & Preferences' },
  { slug: 'technology-innovation', label: 'Technology & Innovation' },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]['slug'];

export function categoryLabel(slug: string | null): string | null {
  if (slug === null) {
    return null;
  }

  return CATEGORIES.find((category) => category.slug === slug)?.label ?? slug;
}
