// Diff Logic — Compare two Pages, produce changes + bump type.
// Pure functions, ZERO framework imports.

import type { Page } from '@/domain/models/page';
import type { ChangeEntry, BumpType, ChangeType } from '@/domain/models/release';

/**
 * Compute a list of granular changes between two page versions.
 */
export function computeDiff(oldPage: Page, newPage: Page): ChangeEntry[] {
  const changes: ChangeEntry[] = [];

  // ── Title change ──
  if (oldPage.title !== newPage.title) {
    changes.push({
      type: 'title-changed',
      description: `Title changed from "${oldPage.title}" to "${newPage.title}"`,
    });
  }

  // ── Build section maps for lookup ──
  const oldSections = new Map(oldPage.sections.map((s) => [s.id, s]));
  const newSections = new Map(newPage.sections.map((s) => [s.id, s]));

  // ── Removed sections (in old, not in new) ──
  for (const [id, section] of oldSections) {
    if (!newSections.has(id)) {
      changes.push({
        type: 'section-removed',
        sectionId: id,
        description: `Removed ${section.type} section "${id}"`,
      });
    }
  }

  // ── Added sections (in new, not in old) ──
  for (const [id, section] of newSections) {
    if (!oldSections.has(id)) {
      changes.push({
        type: 'section-added',
        sectionId: id,
        description: `Added ${section.type} section "${id}"`,
      });
    }
  }

  // ── Modified sections (in both) ──
  for (const [id, newSection] of newSections) {
    const oldSection = oldSections.get(id);
    if (!oldSection) continue; // Already handled as 'added'

    // Type changed
    if (oldSection.type !== newSection.type) {
      changes.push({
        type: 'section-type-changed',
        sectionId: id,
        description: `Section "${id}" type changed from "${oldSection.type}" to "${newSection.type}"`,
      });
      continue; // Don't also check props if type changed
    }

    // Props changed (deep equality via JSON — sufficient for our flat props)
    if (JSON.stringify(oldSection.props) !== JSON.stringify(newSection.props)) {
      changes.push({
        type: 'props-changed',
        sectionId: id,
        description: `Props changed on ${newSection.type} section "${id}"`,
      });
    }
  }

  // ── Reorder detection ──
  // Only check if no sections were added/removed (reorder is meaningful only then)
  const hasStructuralChange = changes.some(
    (c) => c.type === 'section-added' || c.type === 'section-removed'
  );

  if (!hasStructuralChange) {
    const oldOrder = oldPage.sections.map((s) => s.id);
    const newOrder = newPage.sections.map((s) => s.id);

    if (JSON.stringify(oldOrder) !== JSON.stringify(newOrder)) {
      changes.push({
        type: 'section-reordered',
        description: 'Sections were reordered',
      });
    }
  }

  return changes;
}

/**
 * Fixed SemVer bump rules:
 * - major: section removed, section type changed
 * - minor: section added
 * - patch: props changed, title changed, reordered
 *
 * Returns the highest severity among all changes.
 */
const CHANGE_TYPE_TO_BUMP: Record<ChangeType, BumpType> = {
  'section-removed': 'major',
  'section-type-changed': 'major',
  'section-added': 'minor',
  'section-reordered': 'patch',
  'props-changed': 'patch',
  'title-changed': 'patch',
};

const BUMP_SEVERITY: Record<BumpType, number> = {
  patch: 1,
  minor: 2,
  major: 3,
};

export function determineBumpType(changes: ChangeEntry[]): BumpType {
  if (changes.length === 0) {
    return 'patch'; // fallback — shouldn't be called with empty changes
  }

  let highest: BumpType = 'patch';

  for (const change of changes) {
    const bump = CHANGE_TYPE_TO_BUMP[change.type];
    if (BUMP_SEVERITY[bump] > BUMP_SEVERITY[highest]) {
      highest = bump;
    }
  }

  return highest;
}

/**
 * Returns true if there are any changes between the two pages.
 */
export function hasChanges(oldPage: Page, newPage: Page): boolean {
  return computeDiff(oldPage, newPage).length > 0;
}
