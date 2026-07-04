// Domain Models — Release & Versioning
// Pure TypeScript types. ZERO framework imports.

import type { Page } from './page';

export interface Version {
  major: number;
  minor: number;
  patch: number;
}

export type BumpType = 'major' | 'minor' | 'patch';

export type ChangeType =
  | 'section-added'
  | 'section-removed'
  | 'section-type-changed'
  | 'section-reordered'
  | 'props-changed'
  | 'title-changed';

export interface ChangeEntry {
  type: ChangeType;
  sectionId?: string;
  description: string;
}

export interface Release {
  slug: string;
  version: string;
  page: Page;
  changes: ChangeEntry[];
  createdAt: string; // ISO timestamp
}
