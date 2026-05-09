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
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col max-w-lg mx-auto">
      <TopBar />
      <main className="flex-1 overflow-y-auto pt-[60px] pb-[90px] px-4">
        <div className="py-4">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
