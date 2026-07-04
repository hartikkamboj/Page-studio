// Sync to Contentful — Writes page data back to Contentful on publish.
// Creates new Section entries if needed, updates existing ones, and updates the Page entry.

import { getPlainClient } from './management';
import type { Page } from '@/domain/models/page';

/**
 * Sync a published page back to Contentful using the plain client API.
 */
export async function syncPageToContentful(page: Page): Promise<void> {
  const client = getPlainClient();

  const sectionEntryIds: string[] = [];

  // 1. Upsert each section
  for (const section of page.sections) {
    try {
      const existing = await client.entry.getMany({
        query: {
          content_type: 'section',
          'fields.sectionId': section.id,
          limit: 1,
        },
      });

      let entryId: string;

      if (existing.items.length > 0) {
        // Update existing section
        const entry = existing.items[0];
        entry.fields.type = { 'en-US': section.type };
        entry.fields.props = { 'en-US': section.props };

        const updated = await client.entry.update(
          { entryId: entry.sys.id },
          entry
        );
        // Publish using the full sys from the updated entry
        await client.entry.publish(
          { entryId: updated.sys.id },
          updated
        );
        entryId = updated.sys.id;
      } else {
        // Create new section entry
        const created = await client.entry.create(
          { contentTypeId: 'section' },
          {
            fields: {
              sectionId: { 'en-US': section.id },
              type: { 'en-US': section.type },
              props: { 'en-US': section.props },
            },
          }
        );
        await client.entry.publish(
          { entryId: created.sys.id },
          created
        );
        entryId = created.sys.id;
      }

      sectionEntryIds.push(entryId);
    } catch (err) {
      console.error(`Failed to sync section "${section.id}":`, err);
      throw new Error(`Failed to sync section "${section.id}" to Contentful`);
    }
  }

  // 2. Update the Page entry
  try {
    const pages = await client.entry.getMany({
      query: {
        content_type: 'page',
        'fields.slug': page.slug,
        limit: 1,
      },
    });

    if (pages.items.length === 0) {
      throw new Error(`Page with slug "${page.slug}" not found in Contentful`);
    }

    const pageEntry = pages.items[0];

    // Update title
    pageEntry.fields.title = { 'en-US': page.title };

    // Update sections references (ordered)
    pageEntry.fields.sections = {
      'en-US': sectionEntryIds.map((id) => ({
        sys: { type: 'Link' as const, linkType: 'Entry' as const, id },
      })),
    };

    const updated = await client.entry.update(
      { entryId: pageEntry.sys.id },
      pageEntry
    );
    await client.entry.publish(
      { entryId: updated.sys.id },
      updated
    );
  } catch (err) {
    console.error(`Failed to sync page "${page.slug}":`, err);
    throw new Error(`Failed to sync page "${page.slug}" to Contentful`);
  }
}
