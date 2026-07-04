import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserById } from '@/domain/lib/users';
import { canPerformAction } from '@/domain/lib/roles';
import { publishRelease } from '@/usecases/publishRelease';

export async function POST(request: Request) {
  try {
    // 1. Authenticate & Authorize
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = getUserById(sessionCookie.value);
    if (!user || !canPerformAction(user.role, 'publish')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Parse payload
    const { slug, draft } = await request.json();
    if (!slug || !draft) {
      return NextResponse.json({ error: 'Missing slug or draft' }, { status: 400 });
    }

    // 3. Execute Publish Use Case
    const result = await publishRelease(slug, draft);

    // 4. Return result
    return NextResponse.json({
      success: true,
      version: result.release.version,
      isNew: result.isNew,
      changes: result.release.changes,
    });
  } catch (error) {
    console.error('Publish API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
