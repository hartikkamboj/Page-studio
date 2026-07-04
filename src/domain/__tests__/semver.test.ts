import { describe, it, expect } from 'vitest';
import { parseVersion, formatVersion, bumpVersion, compareVersions } from '@/domain/lib/semver';

describe('parseVersion', () => {
  it('parses a valid version string', () => {
    expect(parseVersion('1.2.3')).toEqual({ major: 1, minor: 2, patch: 3 });
  });

  it('parses zero version', () => {
    expect(parseVersion('0.0.0')).toEqual({ major: 0, minor: 0, patch: 0 });
  });

  it('throws on invalid format (too few parts)', () => {
    expect(() => parseVersion('1.2')).toThrow('Invalid version format');
  });

  it('throws on invalid format (too many parts)', () => {
    expect(() => parseVersion('1.2.3.4')).toThrow('Invalid version format');
  });

  it('throws on non-numeric parts', () => {
    expect(() => parseVersion('a.b.c')).toThrow('Invalid version numbers');
  });

  it('throws on negative numbers', () => {
    expect(() => parseVersion('1.-1.0')).toThrow('Invalid version numbers');
  });
});

describe('formatVersion', () => {
  it('formats a Version object to string', () => {
    expect(formatVersion({ major: 1, minor: 2, patch: 3 })).toBe('1.2.3');
  });

  it('formats zero version', () => {
    expect(formatVersion({ major: 0, minor: 0, patch: 0 })).toBe('0.0.0');
  });
});

describe('bumpVersion', () => {
  it('bumps patch: 1.0.0 → 1.0.1', () => {
    expect(bumpVersion('1.0.0', 'patch')).toBe('1.0.1');
  });

  it('bumps minor: 1.2.3 → 1.3.0 (patch resets)', () => {
    expect(bumpVersion('1.2.3', 'minor')).toBe('1.3.0');
  });

  it('bumps major: 1.2.3 → 2.0.0 (minor + patch reset)', () => {
    expect(bumpVersion('1.2.3', 'major')).toBe('2.0.0');
  });

  it('bumps patch from zero: 0.0.0 → 0.0.1', () => {
    expect(bumpVersion('0.0.0', 'patch')).toBe('0.0.1');
  });

  it('bumps major from zero: 0.0.0 → 1.0.0', () => {
    expect(bumpVersion('0.0.0', 'major')).toBe('1.0.0');
  });

  it('handles high numbers: 99.99.99 → 100.0.0', () => {
    expect(bumpVersion('99.99.99', 'major')).toBe('100.0.0');
  });
});

describe('compareVersions', () => {
  it('returns 0 for equal versions', () => {
    expect(compareVersions('1.2.3', '1.2.3')).toBe(0);
  });

  it('returns 1 when a > b (major)', () => {
    expect(compareVersions('2.0.0', '1.0.0')).toBe(1);
  });

  it('returns -1 when a < b (minor)', () => {
    expect(compareVersions('1.1.0', '1.2.0')).toBe(-1);
  });

  it('returns 1 when a > b (patch)', () => {
    expect(compareVersions('1.2.4', '1.2.3')).toBe(1);
  });
});
