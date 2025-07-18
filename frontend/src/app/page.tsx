"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    console.log("HOSTNAMES: ", process.env.NEXT_PUBLIC_API_HOSTNAMES);
    console.log("HOSTNAMES: ", process.env.NEXT_PUBLIC_API_BASE_URL);

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