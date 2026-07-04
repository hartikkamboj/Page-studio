import { NextResponse } from 'next/server';
import { getUserById } from '@/domain/lib/users';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId || !getUserById(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });

    // Set HttpOnly cookie
    response.cookies.set({
      name: 'session',
      value: userId,
      httpOnly: true,
      secure: request.url.startsWith('https://') || request.headers.get('x-forwarded-proto') === 'https',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
