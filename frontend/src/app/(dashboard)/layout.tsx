'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import BottomNav from '@/components/layout/BottomNav';
import TopBar from '@/components/layout/TopBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar />
      <main className="flex-1 pb-24 pt-16 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-4">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
