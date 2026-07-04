'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setDraftPage, setDraftError } from '@/store/slices/draftPageSlice';
import { loadDraft } from '@/adapters/draftStorage';
import StudioLayout from '@/components/studio/StudioLayout';
import { Loader2 } from 'lucide-react';
import type { Page } from '@/domain/models/page';

interface StudioPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function StudioPage(props: StudioPageProps) {
  // Use React.use to unwrap params in a Client Component (Next.js 15)
  const params = use(props.params);
  const slug = params.slug;

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initPage() {
      try {
        // Priority 1: Load unsaved draft from localStorage
        const localDraft = loadDraft(slug);
        if (localDraft) {
          dispatch(setDraftPage(localDraft));
          setLoading(false);
          return;
        }

        // Priority 2: Load latest published release
        const releaseRes = await fetch(`/api/release/${slug}`);
        if (releaseRes.ok) {
          const releaseData = await releaseRes.json();
          if (releaseData.release) {
            dispatch(setDraftPage(releaseData.release.page as Page));
            setLoading(false);
            return;
          }
        }

        // Priority 3: Fetch seed data from Contentful
        const res = await fetch(`/api/page/${slug}?draft=true`);
        
        if (res.status === 404) {
          throw new Error('NOT_FOUND');
        }
        
        if (!res.ok) {
          throw new Error(`Failed to load page: ${res.statusText}`);
        }
        
        const data = await res.json();
        dispatch(setDraftPage(data.page as Page));
      } catch (err) {
        // Fallback: create an empty page so the editor still works
        const mockPage: Page = {
          pageId: `mock-${slug}`,
          slug,
          title: slug.charAt(0).toUpperCase() + slug.slice(1),
          sections: [],
        };
        dispatch(setDraftPage(mockPage));
        
        const isNotFound = err instanceof Error && err.message === 'NOT_FOUND';
        dispatch(
          setDraftError(
            isNotFound
              ? `Page "${slug}" not found in Contentful. You can build it here and publish when ready.`
              : 'Could not connect to Contentful. Using an empty draft. Check your .env.local credentials.'
          )
        );
      } finally {
        setLoading(false);
      }
    }

    initPage();
  }, [slug, dispatch]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return <StudioLayout />;
}
