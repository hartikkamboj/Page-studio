// Release Store — Filesystem implementation (local development).
// Reads/writes releases/<slug>/<version>.json files.

import fs from 'fs/promises';
import path from 'path';
import type { IReleaseStore } from './releaseStore';
import type { Page } from '@/domain/models/page';
import type { Release, ChangeEntry } from '@/domain/models/release';
import { compareVersions } from '@/domain/lib/semver';

const RELEASES_DIR = path.join(process.cwd(), 'releases');

function getSlugDir(slug: string): string {
  return path.join(RELEASES_DIR, slug);
}

function getReleasePath(slug: string, version: string): string {
  return path.join(getSlugDir(slug), `${version}.json`);
}

export const fsReleaseStore: IReleaseStore = {
  async getLatest(slug: string): Promise<Release | null> {
    const slugDir = getSlugDir(slug);

    try {
      await fs.access(slugDir);
    } catch {
      return null; // Directory doesn't exist yet
    }

    const files = await fs.readdir(slugDir);
    const versionFiles = files
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace('.json', ''));

    if (versionFiles.length === 0) return null;

    // Sort by semver, take the latest
    versionFiles.sort((a, b) => compareVersions(b, a)); // Descending
    const latestVersion = versionFiles[0];

    const content = await fs.readFile(
      getReleasePath(slug, latestVersion),
      'utf-8'
    );
    return JSON.parse(content) as Release;
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

    const slugDir = getSlugDir(slug);
    await fs.mkdir(slugDir, { recursive: true });

    const filePath = getReleasePath(slug, version);
    await fs.writeFile(filePath, JSON.stringify(release, null, 2), 'utf-8');

    return release;
  },

  async getAll(slug: string): Promise<Release[]> {
    const slugDir = getSlugDir(slug);

    try {
      await fs.access(slugDir);
    } catch {
      return [];
    }

    const files = await fs.readdir(slugDir);
    const versionFiles = files
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace('.json', ''));

    // Sort descending (newest first)
    versionFiles.sort((a, b) => compareVersions(b, a));

    const releases: Release[] = [];
    for (const version of versionFiles) {
      const content = await fs.readFile(
        getReleasePath(slug, version),
        'utf-8'
      );
      releases.push(JSON.parse(content) as Release);
    }

    return releases;
  },
};
