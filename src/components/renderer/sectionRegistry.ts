// Section Registry — Single source of truth mapping section types to components.
// Adding a new section type = add the component + add one line here.

import type { ComponentType } from 'react';
import type { SectionType } from '@/domain/models/page';

import HeroSection from '@/components/sections/HeroSection';
import FeatureGridSection from '@/components/sections/FeatureGridSection';
import TestimonialSection from '@/components/sections/TestimonialSection';
import CTASection from '@/components/sections/CTASection';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sectionRegistry: Record<SectionType, ComponentType<any>> = {
  hero: HeroSection,
  featureGrid: FeatureGridSection,
  testimonial: TestimonialSection,
  cta: CTASection,
};

/**
 * Look up a component by section type.
 * Returns undefined if the type is not registered.
 */
export function getSectionComponent(
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ComponentType<any> | undefined {
  return sectionRegistry[type as SectionType];
}
