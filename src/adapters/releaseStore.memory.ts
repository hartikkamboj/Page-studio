// Release Store — In-memory implementation (Vercel / serverless).
// Stores releases in a module-level Map. Data resets on cold start.

import type { IReleaseStore } from './releaseStore';
import type { Page } from '@/domain/models/page';
import type { Release, ChangeEntry } from '@/domain/models/release';
import { compareVersions } from '@/domain/lib/semver';

// Module-level storage — persists for the lifetime of the serverless instance
const storage = new Map<string, Release[]>();

export const memoryReleaseStore: IReleaseStore = {
  async getLatest(slug: string): Promise<Release | null> {
    const releases = storage.get(slug);
    if (!releases || releases.length === 0) return null;

    // Already sorted newest first
    return releases[0];
  },

  async save(
    slug: string,
    version: string,
    page: Page,
    changes: ChangeEntry[]
  ): Promise<Release> {
    const release: Release = {
      slug,
      version,
      page,
      changes,
      createdAt: new Date().toISOString(),
    };

    const existing = storage.get(slug) || [];
    existing.unshift(release); // Add to front (newest first)
    existing.sort((a, b) => compareVersions(b.version, a.version));
    storage.set(slug, existing);

    return release;
  },

  async getAll(slug: string): Promise<Release[]> {
    return storage.get(slug) || [];
  },
};
