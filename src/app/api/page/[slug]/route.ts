import { NextResponse } from 'next/server';
import { loadPage } from '@/usecases/loadPage';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const url = new URL(request.url);
  const isDraft = url.searchParams.get('draft') === 'true';

  try {
    const page = await loadPage(slug, isDraft);
    return NextResponse.json({ page });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    // Page doesn't exist in Contentful — return 404, not 500
    if (message.includes('not found')) {
      return NextResponse.json(
        { error: `Page "${slug}" not found in Contentful` },
        { status: 404 }
      );
    }

    console.error(`Error fetching page ${slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to load page' },
      { status: 500 }
    );
  }
}
