// Release Store — Adapter interface.
// Defines what any release store must implement.

import type { Page } from '@/domain/models/page';
import type { Release, ChangeEntry } from '@/domain/models/release';

export interface IReleaseStore {
  /** Get the latest release for a given slug. Returns null if no releases exist. */
  getLatest(slug: string): Promise<Release | null>;

  /** Save a new immutable release snapshot. */
  save(
    slug: string,
    version: string,
    page: Page,
    changes: ChangeEntry[]
  ): Promise<Release>;

  /** Get all releases for a given slug, sorted newest first. */
  getAll(slug: string): Promise<Release[]>;
}
