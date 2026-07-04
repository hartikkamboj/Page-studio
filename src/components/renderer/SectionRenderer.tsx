'use client';

import type { Section } from '@/domain/models/page';
import { getSectionComponent } from './sectionRegistry';
import UnsupportedSection from '@/components/sections/UnsupportedSection';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

interface SectionRendererProps {
  section: Section;
}

/**
 * Renders a single section by looking up its type in the registry.
 * - Known type → render the registered component with its props
 * - Unknown type → render <UnsupportedSection />
 * - Render error → caught by ErrorBoundary (no crash)
 */
export default function SectionRenderer({ section }: SectionRendererProps) {
  const Component = getSectionComponent(section.type);

  return (
    <ErrorBoundary sectionId={section.id}>
      {Component ? (
        // eslint-disable-next-line react-hooks/static-components
        <Component {...section.props} />
      ) : (
        <UnsupportedSection type={section.type} />
      )}
    </ErrorBoundary>
  );
}
