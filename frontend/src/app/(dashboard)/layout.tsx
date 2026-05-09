'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import BottomNav from '@/components/layout/BottomNav';
import TopBar from '@/components/layout/TopBar';
import PWAInstallBanner from '@/components/PWAInstallBanner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace('/login');
    }
  }, [mounted, isAuthenticated, router]);

  // Prevent flash of unauthenticated content
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center">
            <span className="text-white text-xl font-bold">₹</span>
          </div>
          <div className="w-6 h-6 border-2 border-violet-600/30 border-t-violet-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col max-w-lg mx-auto relative">
      <TopBar />
      <main className="flex-1 overflow-y-auto pt-[60px] pb-[90px] px-4">
        <div className="py-4">{children}</div>
      </main>
      <PWAInstallBanner />
      <BottomNav />
    </div>
  );
}
