// Use Case: Load Page
// Orchestrates: Contentful adapter → Zod validation → domain Page

import { fetchPageBySlug } from '@/adapters/contentful/queries';
import type { Page } from '@/domain/models/page';

/**
 * Load a page by slug.
 * Fetches from Contentful, validates with Zod schema, returns typed Page.
 *
 * @param slug - Page slug to load
 * @param isDraft - If true, loads draft (unpublished) content from Contentful
 */
export async function loadPage(
  slug: string,
  isDraft: boolean = false
): Promise<Page> {
  return fetchPageBySlug(slug, isDraft);
}
