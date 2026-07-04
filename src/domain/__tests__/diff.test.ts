import { describe, it, expect } from 'vitest';
import { computeDiff, determineBumpType, hasChanges } from '@/domain/lib/diff';
import type { Page } from '@/domain/models/page';

function makePage(overrides: Partial<Page> = {}): Page {
  return {
    pageId: 'page-1',
    slug: 'homepage',
    title: 'Homepage',
    sections: [],
    ...overrides,
  };
}

describe('computeDiff', () => {
  it('returns empty array when pages are identical', () => {
    const page = makePage({
      sections: [{ id: 's1', type: 'hero', props: { headline: 'Hi' } }],
    });
    expect(computeDiff(page, page)).toEqual([]);
  });

  it('detects title change', () => {
    const old = makePage({ title: 'Old Title' });
    const updated = makePage({ title: 'New Title' });
    const changes = computeDiff(old, updated);
    expect(changes).toHaveLength(1);
    expect(changes[0].type).toBe('title-changed');
  });

  it('detects added section', () => {
    const old = makePage({ sections: [] });
    const updated = makePage({
      sections: [{ id: 's1', type: 'hero', props: { headline: 'Hi' } }],
    });
    const changes = computeDiff(old, updated);
    expect(changes).toHaveLength(1);
    expect(changes[0].type).toBe('section-added');
    expect(changes[0].sectionId).toBe('s1');
  });

  it('detects removed section', () => {
    const old = makePage({
      sections: [{ id: 's1', type: 'hero', props: { headline: 'Hi' } }],
    });
    const updated = makePage({ sections: [] });
    const changes = computeDiff(old, updated);
    expect(changes).toHaveLength(1);
    expect(changes[0].type).toBe('section-removed');
    expect(changes[0].sectionId).toBe('s1');
  });

  it('detects section type change', () => {
    const old = makePage({
      sections: [{ id: 's1', type: 'hero', props: {} }],
    });
    const updated = makePage({
      sections: [{ id: 's1', type: 'cta', props: {} }],
    });
    const changes = computeDiff(old, updated);
    expect(changes).toHaveLength(1);
    expect(changes[0].type).toBe('section-type-changed');
  });

  it('detects props change', () => {
    const old = makePage({
      sections: [{ id: 's1', type: 'hero', props: { headline: 'Old' } }],
    });
    const updated = makePage({
      sections: [{ id: 's1', type: 'hero', props: { headline: 'New' } }],
    });
    const changes = computeDiff(old, updated);
    expect(changes).toHaveLength(1);
    expect(changes[0].type).toBe('props-changed');
  });

  it('detects section reorder', () => {
    const old = makePage({
      sections: [
        { id: 's1', type: 'hero', props: {} },
        { id: 's2', type: 'cta', props: {} },
      ],
    });
    const updated = makePage({
      sections: [
        { id: 's2', type: 'cta', props: {} },
        { id: 's1', type: 'hero', props: {} },
      ],
    });
    const changes = computeDiff(old, updated);
    expect(changes.some((c) => c.type === 'section-reordered')).toBe(true);
  });

  it('detects multiple changes', () => {
    const old = makePage({
      title: 'Old',
      sections: [
        { id: 's1', type: 'hero', props: { headline: 'Hi' } },
        { id: 's2', type: 'cta', props: {} },
      ],
    });
    const updated = makePage({
      title: 'New',
      sections: [
        { id: 's1', type: 'hero', props: { headline: 'Changed' } },
        // s2 removed
        { id: 's3', type: 'testimonial', props: {} }, // s3 added
      ],
    });
    const changes = computeDiff(old, updated);
    expect(changes.length).toBeGreaterThanOrEqual(3); // title + remove + add + props
  });
});

describe('determineBumpType', () => {
  it('returns patch for props-changed', () => {
    expect(determineBumpType([{ type: 'props-changed', description: '' }])).toBe('patch');
  });

  it('returns patch for title-changed', () => {
    expect(determineBumpType([{ type: 'title-changed', description: '' }])).toBe('patch');
  });

  it('returns patch for section-reordered', () => {
    expect(determineBumpType([{ type: 'section-reordered', description: '' }])).toBe('patch');
  });

  it('returns minor for section-added', () => {
    expect(determineBumpType([{ type: 'section-added', description: '' }])).toBe('minor');
  });

  it('returns major for section-removed', () => {
    expect(determineBumpType([{ type: 'section-removed', description: '' }])).toBe('major');
  });

  it('returns major for section-type-changed', () => {
    expect(determineBumpType([{ type: 'section-type-changed', description: '' }])).toBe('major');
  });

  it('returns highest severity when mixed: patch + minor → minor', () => {
    expect(
      determineBumpType([
        { type: 'props-changed', description: '' },
        { type: 'section-added', description: '' },
      ])
    ).toBe('minor');
  });

  it('returns highest severity when mixed: minor + major → major', () => {
    expect(
      determineBumpType([
        { type: 'section-added', description: '' },
        { type: 'section-removed', description: '' },
      ])
    ).toBe('major');
  });
});

describe('hasChanges', () => {
  it('returns false for identical pages', () => {
    const page = makePage({ sections: [{ id: 's1', type: 'hero', props: {} }] });
    expect(hasChanges(page, page)).toBe(false);
  });

  it('returns true when sections differ', () => {
    const old = makePage({ sections: [] });
    const updated = makePage({ sections: [{ id: 's1', type: 'hero', props: {} }] });
    expect(hasChanges(old, updated)).toBe(true);
  });
});
