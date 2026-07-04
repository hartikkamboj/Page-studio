import { notFound } from 'next/navigation';
import { createReleaseStore } from '@/adapters/releaseStore.factory';
import { loadPage } from '@/usecases/loadPage';
import PageRenderer from '@/components/renderer/PageRenderer';
import type { Page } from '@/domain/models/page';

interface PreviewPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    source?: string;
  }>;
}

export default async function PreviewPage(props: PreviewPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const { slug } = params;
  const source = searchParams.source; // ?source=contentful to force Contentful fetch

  let page: Page | null = null;

  // 1. Try to load the latest PUBLISHED release first (unless ?source=contentful)
  if (source !== 'contentful') {
    try {
      const store = createReleaseStore();
      const latest = await store.getLatest(slug);
      if (latest) {
        page = latest.page;
      }
    } catch {
      // Release store failed — fall through to Contentful
    }
  }

  // 2. Fall back to Contentful if no published release exists
  if (!page) {
    try {
      page = await loadPage(slug, false);
    } catch (error) {
      console.error(`Failed to load preview for slug "${slug}":`, error);

      if (error instanceof Error && error.message.includes('not found')) {
        notFound();
      }

      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-500">Error Loading Page</h1>
          <p className="text-slate-400">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen">
      <PageRenderer page={page} />
    </div>
  );
}
