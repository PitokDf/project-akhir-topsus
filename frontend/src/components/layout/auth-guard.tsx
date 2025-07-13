"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth';
import { User } from '@/lib/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'CASHIER';
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    
    if (!currentUser) {
      router.push('/login');
      return;
    }

    if (requiredRole && currentUser.role !== requiredRole) {
      router.push('/unauthorized');
      return;
    }

    setUser(currentUser);
    setLoading(false);
  }, [router, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}