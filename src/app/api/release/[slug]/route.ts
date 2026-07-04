import { NextResponse } from 'next/server';
import { createReleaseStore } from '@/adapters/releaseStore.factory';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const store = createReleaseStore();
    const latest = await store.getLatest(slug);

    if (!latest) {
      return NextResponse.json({ release: null }, { status: 200 });
    }

    return NextResponse.json({ release: latest });
  } catch (error) {
    console.error(`Error fetching release for ${slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch release' },
      { status: 500 }
    );
  }
}
