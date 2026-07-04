import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { cookies } from 'next/headers';
import { getUserById } from '@/domain/lib/users';
import { canAccessRoute } from '@/domain/lib/roles';
import { cn } from '@/lib/utils';
import { fetchAllPageSlugs } from '@/adapters/contentful/queries';

export default async function Dashboard() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  const user = sessionCookie ? getUserById(sessionCookie.value) : null;

  if (!user) return null;

  const canEdit = canAccessRoute(user.role, '/studio');

  // Fetch real pages from Contentful instead of hardcoding
  let slugs: string[] = [];
  try {
    slugs = await fetchAllPageSlugs();
  } catch (err) {
    console.error('Failed to fetch page list from Contentful:', err);
  }

  return (
    <main id="main-content" className="mx-auto max-w-5xl p-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white">Pages</h1>
        <p className="mt-2 text-slate-400">
          Manage your landing pages. Your current role is <span className="font-semibold text-purple-400">{user.role}</span>.
        </p>
      </div>

      {slugs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-700 p-12 text-center">
          <p className="text-lg text-slate-400">No pages found in Contentful.</p>
          <p className="mt-2 text-sm text-slate-500">
            Create a Page entry in your Contentful space to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {slugs.map((slug) => (
            <Card key={slug} className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  {slug.charAt(0).toUpperCase() + slug.slice(1)}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Slug: /{slug}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Link
                  href={`/preview/${slug}`}
                  className={cn(buttonVariants({ variant: 'default' }), 'w-full bg-slate-800 text-white hover:bg-slate-700')}
                >
                  View Live Preview
                </Link>

                {canEdit ? (
                  <Link
                    href={`/studio/${slug}`}
                    className={cn(buttonVariants({ variant: 'outline' }), 'w-full bg-transparent border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300')}
                  >
                    Open in Studio
                  </Link>
                ) : (
                  <Button variant="outline" className="w-full bg-transparent" disabled title="You do not have permission to edit">
                    Open in Studio (Locked)
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
