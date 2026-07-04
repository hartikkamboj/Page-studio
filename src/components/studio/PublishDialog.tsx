'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { publishDraft, resetPublish } from '@/store/slices/publishSlice';
import { markClean } from '@/store/slices/draftPageSlice';
import { clearDraft } from '@/adapters/draftStorage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PublishDialog({ open, onOpenChange }: PublishDialogProps) {
  const dispatch = useAppDispatch();
  const page = useAppSelector((s) => s.draftPage.page);
  const publishState = useAppSelector((s) => s.publish);

  const handlePublish = async () => {
    if (!page) return;
    const resultAction = await dispatch(publishDraft(page.slug));
    if (publishDraft.fulfilled.match(resultAction)) {
      dispatch(markClean());
      clearDraft(page.slug);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => dispatch(resetPublish()), 300); // Reset state after animation
  };

  const isLoading = publishState.status === 'loading';
  const isSuccess = publishState.status === 'success';
  const isError = publishState.status === 'error';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Publish Page</DialogTitle>
          <DialogDescription>
            Are you sure you want to publish these changes? This will create a new
            versioned release.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isError && (
            <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500">
              {publishState.error}
            </div>
          )}

          {isSuccess && (
            <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-500">
              <p className="font-semibold">Published Successfully!</p>
              <p>Version: {publishState.lastPublishedVersion}</p>
              {publishState.changelog.length > 0 && (
                <ul className="mt-2 list-disc pl-5 text-xs opacity-80">
                  {publishState.changelog.map((c, i) => (
                    <li key={i}>{c.description}</li>
                  ))}
                </ul>
              )}
              {publishState.changelog.length === 0 && (
                <p className="mt-1 text-xs opacity-80">
                  No changes detected. Existing version preserved.
                </p>
              )}
            </div>
          )}

          {!isSuccess && !isError && (
            <div className="text-sm text-slate-500">
              Click publish to proceed.
            </div>
          )}
        </div>

        <DialogFooter>
          {isSuccess ? (
            <Button onClick={handleClose}>Done</Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handlePublish} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  'Publish'
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
