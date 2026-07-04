// Contentful Mapper — Transforms Contentful entries into domain types.
// ALL Contentful-specific field access is isolated here.

import type { Entry } from 'contentful';
import type { Page, Section, SectionType, SECTION_TYPES } from '@/domain/models/page';

/**
 * Contentful content type IDs (must match your Contentful space).
 *
 * Expected Contentful content models:
 *
 * Page:
 *   - pageId (Short text)
 *   - slug (Short text)
 *   - title (Short text)
 *   - sections (References, many — to Section entries)
 *
 * Section:
 *   - sectionId (Short text)
 *   - type (Short text — one of: hero, featureGrid, testimonial, cta)
 *   - props (JSON object)
 */
export const CONTENT_TYPE_PAGE = 'page';
export const CONTENT_TYPE_SECTION = 'section';

/**
 * Map a Contentful Section entry to our domain Section type.
 */
export function mapContentfulEntryToSection(entry: Entry): Section {
  const fields = entry.fields as Record<string, unknown>;

  return {
    id: (fields.sectionId as string) || entry.sys.id,
    type: fields.type as SectionType,
    props: (fields.props as Record<string, unknown>) || {},
  };
}

/**
 * Map a Contentful Page entry (with linked Section entries) to our domain Page type.
 */
export function mapContentfulEntryToPage(entry: Entry): Page {
  const fields = entry.fields as Record<string, unknown>;
  const sectionEntries = (fields.sections as Entry[]) || [];

  return {
    pageId: (fields.pageId as string) || entry.sys.id,
    slug: fields.slug as string,
    title: fields.title as string,
    sections: sectionEntries.map(mapContentfulEntryToSection),
  };
}
