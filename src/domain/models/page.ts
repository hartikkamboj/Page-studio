// Domain Models — Page & Section
// Pure TypeScript types. ZERO framework imports.

export const SECTION_TYPES = ['hero', 'featureGrid', 'testimonial', 'cta'] as const;
export type SectionType = (typeof SECTION_TYPES)[number];

export interface Section {
  id: string;
  type: SectionType;
  props: Record<string, unknown>;
}

export interface Page {
  pageId: string;
  slug: string;
  title: string;
  sections: Section[];
}

// ── Per-section prop types (used by components + schemas) ──

export interface HeroProps {
  headline: string;
  subtext: string;
  ctaLabel?: string;
  ctaUrl?: string;
  backgroundImage?: string;
}

export interface FeatureGridProps {
  heading: string;
  features: {
    title: string;
    description: string;
    icon?: string;
  }[];
}

export interface TestimonialProps {
  quote: string;
  author: string;
  role?: string;
  avatarUrl?: string;
}

export interface CTAProps {
  heading: string;
  description?: string;
  buttonLabel: string;
  buttonUrl: string;
}

// Map section type → prop type
export type SectionPropsMap = {
  hero: HeroProps;
  featureGrid: FeatureGridProps;
  testimonial: TestimonialProps;
  cta: CTAProps;
};
