// Zod Schemas for Page & Section validation
// Pure validation — no framework imports.

import { z } from 'zod';
import { SECTION_TYPES } from '@/domain/models/page';
import type { Page } from '@/domain/models/page';

// ── Per-section prop schemas ──

export const heroPropsSchema = z.object({
  headline: z.string().min(1, 'Headline is required'),
  subtext: z.string().min(1, 'Subtext is required'),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().url('Must be a valid URL').optional(),
  backgroundImage: z.string().optional(),
});

export const featureGridPropsSchema = z.object({
  heading: z.string().min(1, 'Heading is required'),
  features: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      icon: z.string().optional(),
    })
  ).min(1, 'At least one feature is required'),
});

export const testimonialPropsSchema = z.object({
  quote: z.string().min(1, 'Quote is required'),
  author: z.string().min(1, 'Author is required'),
  role: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export const ctaPropsSchema = z.object({
  heading: z.string().min(1, 'Heading is required'),
  description: z.string().optional(),
  buttonLabel: z.string().min(1, 'Button label is required'),
  buttonUrl: z.string().url('Must be a valid URL'),
});

// Map section type → Zod schema for its props
export const sectionPropsSchemaMap: Record<string, z.ZodType> = {
  hero: heroPropsSchema,
  featureGrid: featureGridPropsSchema,
  testimonial: testimonialPropsSchema,
  cta: ctaPropsSchema,
};

// ── Section schema ──

export const sectionSchema = z.object({
  id: z.string().min(1, 'Section ID is required'),
  type: z.enum(SECTION_TYPES),
  props: z.record(z.string(), z.unknown()),
});

// ── Page schema ──

export const pageSchema = z.object({
  pageId: z.string().min(1, 'Page ID is required'),
  slug: z.string().min(1, 'Slug is required'),
  title: z.string().min(1, 'Title is required'),
  sections: z.array(sectionSchema),
});

// ── Parse function: validates raw data → typed Page ──

export type PageParseResult =
  | { success: true; data: Page }
  | { success: false; errors: z.ZodError };

export function parsePageSchema(data: unknown): PageParseResult {
  const result = pageSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data as Page };
  }
  return { success: false, errors: result.error };
}

// ── Validate section props against their type-specific schema ──

export function validateSectionProps(
  type: string,
  props: Record<string, unknown>
): { valid: boolean; errors?: z.ZodError } {
  const schema = sectionPropsSchemaMap[type];
  if (!schema) {
    // Unknown type — we allow it (handled at render time via UnsupportedSection)
    return { valid: true };
  }
  const result = schema.safeParse(props);
  if (result.success) {
    return { valid: true };
  }
  return { valid: false, errors: result.error };
}
