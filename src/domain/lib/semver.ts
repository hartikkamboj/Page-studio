// SemVer Logic — Pure functions, ZERO framework imports.

import type { Version, BumpType } from '@/domain/models/release';

/**
 * Parse a semver string "1.2.3" into a Version object.
 * Throws on invalid format.
 */
export function parseVersion(str: string): Version {
  const parts = str.split('.');
  if (parts.length !== 3) {
    throw new Error(`Invalid version format: "${str}". Expected "major.minor.patch".`);
  }

  const [major, minor, patch] = parts.map(Number);

  if ([major, minor, patch].some((n) => isNaN(n) || n < 0 || !Number.isInteger(n))) {
    throw new Error(`Invalid version numbers in: "${str}".`);
  }

  return { major, minor, patch };
}

/**
 * Format a Version object back to a string "1.2.3".
 */
export function formatVersion(v: Version): string {
  return `${v.major}.${v.minor}.${v.patch}`;
}

/**
 * Bump a version string by the given bump type.
 * - patch: 1.2.3 → 1.2.4
 * - minor: 1.2.3 → 1.3.0  (patch resets)
 * - major: 1.2.3 → 2.0.0  (minor + patch reset)
 */
export function bumpVersion(current: string, type: BumpType): string {
  const v = parseVersion(current);

  switch (type) {
    case 'patch':
      return formatVersion({ ...v, patch: v.patch + 1 });
    case 'minor':
      return formatVersion({ ...v, minor: v.minor + 1, patch: 0 });
    case 'major':
      return formatVersion({ major: v.major + 1, minor: 0, patch: 0 });
    default: {
      // Exhaustive check
      const _exhaustive: never = type;
      throw new Error(`Unknown bump type: ${_exhaustive}`);
    }
  }
}

/**
 * Compare two version strings.
 * Returns: -1 if a < b, 0 if equal, 1 if a > b.
 */
export function compareVersions(a: string, b: string): -1 | 0 | 1 {
  const va = parseVersion(a);
  const vb = parseVersion(b);

  if (va.major !== vb.major) return va.major > vb.major ? 1 : -1;
  if (va.minor !== vb.minor) return va.minor > vb.minor ? 1 : -1;
  if (va.patch !== vb.patch) return va.patch > vb.patch ? 1 : -1;
  return 0;
}
