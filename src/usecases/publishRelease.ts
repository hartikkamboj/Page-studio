// Use Case: Publish Release
// Orchestrates: release store → diff → semver → save snapshot → sync to Contentful

import { createReleaseStore } from '@/adapters/releaseStore.factory';
import { computeDiff, determineBumpType } from '@/domain/lib/diff';
import { bumpVersion } from '@/domain/lib/semver';
import { syncPageToContentful } from '@/adapters/contentful/sync';
import type { Page } from '@/domain/models/page';
import type { Release } from '@/domain/models/release';

const INITIAL_VERSION = '1.0.0';

export interface PublishResult {
  release: Release;
  isNew: boolean; // false if idempotent (no changes)
}

/**
 * Publish a draft as an immutable, versioned release.
 *
 * 1. Get latest release for this slug
 * 2. Compute diff against new draft
 * 3. If no changes → return existing release (idempotent)
 * 4. Determine bump type from changes
 * 5. Bump version
 * 6. Save immutable snapshot
 * 7. Sync changes back to Contentful (two-way sync)
 */
export async function publishRelease(
  slug: string,
  draft: Page
): Promise<PublishResult> {
  const store = createReleaseStore();
  const lastRelease = await store.getLatest(slug);

  // First release ever
  if (!lastRelease) {
    const release = await store.save(slug, INITIAL_VERSION, draft, []);

    // Sync to Contentful
    await syncToContentfulSafe(draft);

    return { release, isNew: true };
  }

  // Compute diff
  const changes = computeDiff(lastRelease.page, draft);

  // Idempotent: no changes → return existing release
  if (changes.length === 0) {
    return { release: lastRelease, isNew: false };
  }

  // Determine version bump
  const bumpType = determineBumpType(changes);
  const newVersion = bumpVersion(lastRelease.version, bumpType);

  // Save immutable snapshot
  const release = await store.save(slug, newVersion, draft, changes);

  // Sync to Contentful
  await syncToContentfulSafe(draft);

  return { release, isNew: true };
}

/**
 * Sync to Contentful with graceful failure.
 * The release is already saved — if Contentful sync fails,
 * we log the error but don't fail the publish.
 */
async function syncToContentfulSafe(page: Page): Promise<void> {
  try {
    if (!process.env.CONTENTFUL_MANAGEMENT_TOKEN) {
      console.warn('CONTENTFUL_MANAGEMENT_TOKEN not set — skipping Contentful sync');
      return;
    }
    await syncPageToContentful(page);
    console.log(`✅ Synced page "${page.slug}" to Contentful`);
  } catch (err) {
    console.error(`⚠️ Contentful sync failed (release was still saved):`, err);
  }
}
