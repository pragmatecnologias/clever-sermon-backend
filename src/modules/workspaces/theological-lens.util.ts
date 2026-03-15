export type TheologicalLens = 'adventist';

export const ADVENTIST_LENS: TheologicalLens = 'adventist';

// The platform is Adventist-only. Keep this explicit in one place.
export function normalizeTheologicalLens(_lens?: string | null): TheologicalLens {
  return ADVENTIST_LENS;
}
