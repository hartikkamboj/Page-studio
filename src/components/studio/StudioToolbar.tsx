'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setEditorMode } from '@/store/slices/uiSlice';
import { Button } from '@/components/ui/button';
import PublishDialog from './PublishDialog';
import { clearDraft } from '@/adapters/draftStorage';
import { RefreshCw } from 'lucide-react';

interface StudioToolbarProps {
  canPublish: boolean;
}

export default function StudioToolbar({ canPublish }: StudioToolbarProps) {
  const dispatch = useAppDispatch();
  const page = useAppSelector((s) => s.draftPage.page);
  const isDirty = useAppSelector((s) => s.draftPage.isDirty);
  const editorMode = useAppSelector((s) => s.ui.editorMode);
  
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);

  if (!page) return null;

  return (
    <div className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950 px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-white">
          {page.title}
        </h1>
        {isDirty && (
          <span className="rounded bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-500">
            Unsaved Changes
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-lg bg-slate-900 p-1">
          <Button
            variant={editorMode === 'edit' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => dispatch(setEditorMode('edit'))}
            className="h-8"
          >
            Edit
          </Button>
          <Button
            variant={editorMode === 'preview' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => dispatch(setEditorMode('preview'))}
            className="h-8"
          >
            Preview
          </Button>
        </div>

        {canPublish && (
          <Button
            variant="default"
            size="sm"
            onClick={() => setPublishDialogOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Publish
          </Button>
        )}

        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            if (confirm('Discard any unsaved changes and reload the latest published version?')) {
              clearDraft(page.slug);
              window.location.reload();
            }
          }}
          title="Discard draft and sync from published version"
        >
          <RefreshCw className="mr-2 h-3 w-3" />
          Sync Latest
        </Button>
      </div>

      <PublishDialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen} />
    </div>
  );
}
