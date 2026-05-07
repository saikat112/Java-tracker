'use client';

import { useAuthStore } from '@/store/authStore';
import { Bell } from 'lucide-react';

export default function TopBar() {
  const { user } = useAuthStore();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-40 safe-top">
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <span className="font-bold text-gray-900">ExpenseTracker</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition">
            <Bell size={20} />
          </button>
          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
            <span className="text-violet-700 font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
