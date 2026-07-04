import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 text-6xl" aria-hidden="true">
        🔒
      </div>
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Access Denied
      </h1>
      <p className="mx-auto mb-8 max-w-md text-lg text-slate-400">
        You do not have the required permissions to access this page.
      </p>
      <div className="flex gap-4">
        <Link href="/" className={cn(buttonVariants({ variant: 'outline' }))}>
          Back to Dashboard
        </Link>
        <Link href="/login" className={cn(buttonVariants({ variant: 'default' }))}>
          Log in as a different user
        </Link>
      </div>
    </div>
  );
}
