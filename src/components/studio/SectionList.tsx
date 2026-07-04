'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeSection, moveSection } from '@/store/slices/draftPageSlice';
import { selectSection, deselectSection } from '@/store/slices/uiSlice';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const SECTION_TYPE_LABELS: Record<string, string> = {
  hero: '🎯 Hero',
  featureGrid: '📦 Feature Grid',
  testimonial: '💬 Testimonial',
  cta: '🚀 Call to Action',
};

export default function SectionList() {
  const dispatch = useAppDispatch();
  const sections = useAppSelector((s) => s.draftPage.page?.sections ?? []);
  const selectedId = useAppSelector((s) => s.ui.selectedSectionId);

  if (sections.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-slate-500">
        No sections yet. Add one below.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-800" role="list" aria-label="Page sections">
      {sections.map((section, index) => {
        const isSelected = selectedId === section.id;

        return (
          <li
            key={section.id}
            className={`group flex items-center gap-3 px-4 py-3 transition-colors ${
              isSelected
                ? 'bg-purple-500/10 border-l-2 border-purple-500'
                : 'hover:bg-slate-900/50 border-l-2 border-transparent'
            }`}
          >
            {/* Select the section */}
            <button
              className="flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded"
              onClick={() =>
                dispatch(isSelected ? deselectSection() : selectSection(section.id))
              }
              aria-label={`Select ${SECTION_TYPE_LABELS[section.type] || section.type} section`}
              aria-pressed={isSelected}
            >
              <span className="text-sm font-medium text-white">
                {SECTION_TYPE_LABELS[section.type] || section.type}
              </span>
              <Badge variant="secondary" className="ml-2 text-xs">
                {index + 1}
              </Badge>
            </button>

            {/* Action buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-slate-400 hover:bg-slate-700 hover:text-white"
                onClick={() =>
                  dispatch(moveSection({ sectionId: section.id, direction: 'up' }))
                }
                disabled={index === 0}
                aria-label="Move section up"
              >
                ↑
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-slate-400 hover:bg-slate-700 hover:text-white"
                onClick={() =>
                  dispatch(moveSection({ sectionId: section.id, direction: 'down' }))
                }
                disabled={index === sections.length - 1}
                aria-label="Move section down"
              >
                ↓
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-slate-400 hover:bg-red-500/20 hover:text-red-400"
                onClick={() => {
                  dispatch(removeSection(section.id));
                  if (isSelected) dispatch(deselectSection());
                }}
                aria-label={`Remove ${SECTION_TYPE_LABELS[section.type] || section.type} section`}
              >
                ×
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
