import { describe, it, expect } from 'vitest';
import { parsePageSchema, validateSectionProps } from '@/domain/schemas/page.schema';

describe('parsePageSchema', () => {
  const validPage = {
    pageId: 'page-1',
    slug: 'homepage',
    title: 'Homepage',
    sections: [
      {
        id: 'section-1',
        type: 'hero',
        props: { headline: 'Welcome', subtext: 'Hello World' },
      },
    ],
  };

  it('accepts a valid page', () => {
    const result = parsePageSchema(validPage);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.slug).toBe('homepage');
      expect(result.data.sections).toHaveLength(1);
    }
  });

  it('accepts a page with empty sections array', () => {
    const result = parsePageSchema({ ...validPage, sections: [] });
    expect(result.success).toBe(true);
  });

  it('rejects missing pageId', () => {
    const noId = { ...validPage } as Record<string, unknown>;
    delete noId.pageId;
    const result = parsePageSchema(noId);
    expect(result.success).toBe(false);
  });

  it('rejects missing slug', () => {
    const noSlug = { ...validPage } as Record<string, unknown>;
    delete noSlug.slug;
    const result = parsePageSchema(noSlug);
    expect(result.success).toBe(false);
  });

  it('rejects missing title', () => {
    const noTitle = { ...validPage } as Record<string, unknown>;
    delete noTitle.title;
    const result = parsePageSchema(noTitle);
    expect(result.success).toBe(false);
  });

  it('rejects empty string for required fields', () => {
    const result = parsePageSchema({ ...validPage, slug: '' });
    expect(result.success).toBe(false);
  });

  it('rejects section with invalid type', () => {
    const result = parsePageSchema({
      ...validPage,
      sections: [{ id: 's1', type: 'nonexistent', props: {} }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects section with missing id', () => {
    const result = parsePageSchema({
      ...validPage,
      sections: [{ type: 'hero', props: {} }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects non-object input', () => {
    expect(parsePageSchema(null).success).toBe(false);
    expect(parsePageSchema(undefined).success).toBe(false);
    expect(parsePageSchema('string').success).toBe(false);
    expect(parsePageSchema(42).success).toBe(false);
  });

  it('accepts valid section types: hero, featureGrid, testimonial, cta', () => {
    for (const type of ['hero', 'featureGrid', 'testimonial', 'cta']) {
      const result = parsePageSchema({
        ...validPage,
        sections: [{ id: 's1', type, props: {} }],
      });
      expect(result.success).toBe(true);
    }
  });
});

describe('validateSectionProps', () => {
  it('validates valid hero props', () => {
    const result = validateSectionProps('hero', {
      headline: 'Hello',
      subtext: 'World',
    });
    expect(result.valid).toBe(true);
  });

  it('rejects hero with missing headline', () => {
    const result = validateSectionProps('hero', { subtext: 'World' });
    expect(result.valid).toBe(false);
  });

  it('validates valid CTA props', () => {
    const result = validateSectionProps('cta', {
      heading: 'Get Started',
      buttonLabel: 'Click Me',
      buttonUrl: 'https://example.com',
    });
    expect(result.valid).toBe(true);
  });

  it('rejects CTA with invalid URL', () => {
    const result = validateSectionProps('cta', {
      heading: 'Get Started',
      buttonLabel: 'Click Me',
      buttonUrl: 'not-a-url',
    });
    expect(result.valid).toBe(false);
  });

  it('returns valid for unknown section type (handled at render time)', () => {
    const result = validateSectionProps('unknown-type', { anything: 'goes' });
    expect(result.valid).toBe(true);
  });

  it('validates featureGrid with features array', () => {
    const result = validateSectionProps('featureGrid', {
      heading: 'Features',
      features: [{ title: 'Fast', description: 'Very fast' }],
    });
    expect(result.valid).toBe(true);
  });

  it('rejects featureGrid with empty features', () => {
    const result = validateSectionProps('featureGrid', {
      heading: 'Features',
      features: [],
    });
    expect(result.valid).toBe(false);
  });
});
