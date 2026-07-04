'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { User } from '@/domain/lib/users';

export default function UserMenu({ user }: { user: User | null }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-2 text-slate-300">
        <span>{user.name}</span>
        <Badge
          variant="outline"
          className={
            user.role === 'publisher'
              ? 'border-red-500/30 text-red-400'
              : user.role === 'editor'
              ? 'border-blue-500/30 text-blue-400'
              : 'border-green-500/30 text-green-400'
          }
        >
          {user.role}
        </Badge>
      </div>
      <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-400 hover:text-white">
        Logout
      </Button>
    </div>
  );
}
