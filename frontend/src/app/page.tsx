"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    
    if (!user) {
      router.push('/login');
    } else if (user.role === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/cashier');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}