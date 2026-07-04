import { cookies } from 'next/headers';
import { getUserById } from '@/domain/lib/users';
import { canPerformAction } from '@/domain/lib/roles';
import StudioToolbar from '@/components/studio/StudioToolbar';

export default async function StudioLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  const user = sessionCookie ? getUserById(sessionCookie.value) : null;

  const canPublish = user ? canPerformAction(user.role, 'publish') : false;

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
      <StudioToolbar canPublish={canPublish} />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
