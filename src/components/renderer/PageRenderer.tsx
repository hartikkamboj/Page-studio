'use client';

import type { Page } from '@/domain/models/page';
import SectionRenderer from './SectionRenderer';

interface PageRendererProps {
  page: Page;
}

/**
 * Renders all sections of a page in order.
 * Each section is independently rendered + error-bounded.
 */
export default function PageRenderer({ page }: PageRendererProps) {
  if (page.sections.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
        <p>This page has no sections yet.</p>
      </div>
    );
  }

  return (
    <main id="main-content">
      {page.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </main>
  );
}
