'use client';

import { useAuthStore } from '@/store/authStore';
import { Bell } from 'lucide-react';

export default function TopBar() {
  const { user } = useAuthStore();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 safe-top">
      <div className="glass border-b border-gray-100">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-bold">₹</span>
            </div>
            <span className="font-bold text-gray-900 text-base">ExpenseTracker</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">{initials}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
