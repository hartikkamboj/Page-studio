'use client';

import { useAppSelector } from '@/store/hooks';
import SectionList from './SectionList';
import PropEditor from './PropEditor';
import AddSectionPanel from './AddSectionPanel';
import PageRenderer from '@/components/renderer/PageRenderer';

/**
 * Studio Layout: split view with editor panel (left) and live preview (right).
 */
export default function StudioLayout() {
  const page = useAppSelector((s) => s.draftPage.page);
  const editorMode = useAppSelector((s) => s.ui.editorMode);

  if (!page) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500">Loading page…</p>
      </div>
    );
  }

  // Full preview mode
  if (editorMode === 'preview') {
    return <PageRenderer page={page} />;
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row">
      {/* Left panel: section list + prop editor */}
      <aside
        className="w-full border-r border-slate-800 bg-slate-950 lg:w-[400px] lg:min-w-[400px]"
        aria-label="Editor panel"
      >
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="border-b border-slate-800 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Sections
            </h2>
          </div>

          <SectionList />

          <div className="border-t border-slate-800 p-4">
            <AddSectionPanel />
          </div>

          <PropEditor />
        </div>
      </aside>

      {/* Right panel: live preview */}
      <div
        className="flex-1 overflow-y-auto bg-slate-900"
        aria-label="Page preview"
      >
        <PageRenderer page={page} />
      </div>
    </div>
  );
}
