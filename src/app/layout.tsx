import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import StoreProvider from '@/store/StoreProvider';
import UserMenu from '@/components/shared/UserMenu';
import { cookies } from 'next/headers';
import { getUserById } from '@/domain/lib/users';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Page Studio',
  description: 'A schema-driven WYSIWYG landing page editor',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  const user = sessionCookie ? getUserById(sessionCookie.value) : null;

  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-50 antialiased`}>
        <StoreProvider>
          {/* Skip-to-content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-purple-600 focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to main content
          </a>

          {/* Global Header */}
          {user && (
            <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 backdrop-blur-sm">
              <div className="font-semibold text-white">Page Studio</div>
              <UserMenu user={user} />
            </header>
          )}

          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
