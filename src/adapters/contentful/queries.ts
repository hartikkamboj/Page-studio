// Contentful Queries — Fetch functions that use the client + mapper.
// Returns domain types. No Contentful types leak out.

import { getClient } from './client';
import { mapContentfulEntryToPage, CONTENT_TYPE_PAGE } from './mapper';
import { parsePageSchema } from '@/domain/schemas/page.schema';
import type { Page } from '@/domain/models/page';

/**
 * Fetch a page by slug from Contentful.
 *
 * @param slug - The page slug to look up
 * @param isDraft - If true, uses the Preview API (draft content)
 * @returns Validated Page object
 * @throws If page not found or validation fails
 */
export async function fetchPageBySlug(
  slug: string,
  isDraft: boolean = false
): Promise<Page> {
  const client = getClient(isDraft);

  const response = await client.getEntries({
    content_type: CONTENT_TYPE_PAGE,
    'fields.slug': slug,
    include: 2, // Resolve linked section entries
    limit: 1,
  });

  if (response.items.length === 0) {
    throw new Error(`Page not found: "${slug}"`);
  }

  const entry = response.items[0];
  const page = mapContentfulEntryToPage(entry);

  // Validate against Zod schema
  const result = parsePageSchema(page);
  if (!result.success) {
    throw new Error(
      `Invalid page data from Contentful for slug "${slug}": ${result.errors.message}`
    );
  }

  return result.data;
}

/**
 * Fetch all page slugs (for generating static paths or listing pages).
 */
export async function fetchAllPageSlugs(
  isDraft: boolean = false
): Promise<string[]> {
  const client = getClient(isDraft);

  const response = await client.getEntries({
    content_type: CONTENT_TYPE_PAGE,
    select: ['fields.slug'],
    limit: 100,
  });

  return response.items.map(
    (entry) => (entry.fields as Record<string, unknown>).slug as string
  );
}
