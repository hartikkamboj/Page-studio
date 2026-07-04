'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllUsers } from '@/domain/lib/users';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const users = getAllUsers();

  const handleLogin = async (userId: string) => {
    setLoadingId(userId);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        window.location.href = '/';
      } else {
        console.error('Login failed');
        setLoadingId(null);
      }
    } catch (e) {
      console.error(e);
      setLoadingId(null);
    }
  };

  return (
    <main id="main-content" className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Page Studio
          </h1>
          <p className="mt-2 text-slate-400">
            Select a demo user to log in and test RBAC.
          </p>
        </div>

        <div className="grid gap-4">
          {users.map((user) => (
            <Card
              key={user.id}
              className="cursor-pointer border-slate-800 bg-slate-900 transition-colors hover:border-purple-500/50 hover:bg-slate-900/80"
              onClick={() => handleLogin(user.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleLogin(user.id);
                }
              }}
              aria-label={`Log in as ${user.name} (${user.role})`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold text-white">
                  {user.name}
                </CardTitle>
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
              </CardHeader>
              <CardContent>
                <CardDescription className="flex items-center text-slate-400">
                  {loadingId === user.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
                    </>
                  ) : (
                    <span>
                      {user.role === 'publisher' && 'Can edit and publish'}
                      {user.role === 'editor' && 'Can edit drafts only'}
                      {user.role === 'viewer' && 'Can view previews only'}
                    </span>
                  )}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
