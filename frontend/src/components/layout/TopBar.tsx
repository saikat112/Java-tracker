'use client';
import { useAuthStore } from '@/store/authStore';

export default function TopBar() {
  const { user } = useAuthStore();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-[60px]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-violet-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm font-bold">₹</span>
          </div>
          <span className="font-bold text-gray-900 text-[17px] tracking-tight">ExpenseTracker</span>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-xs">{initials}</span>
        </div>
      </div>
    </header>
  );
}
