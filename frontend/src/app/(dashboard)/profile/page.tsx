'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { LogOut, User, Shield, Bell, ChevronRight } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

      <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-6 text-white text-center">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
        </div>
        <h2 className="text-xl font-bold">{user?.name}</h2>
        <p className="text-violet-200 text-sm">{user?.email}</p>
        <span className="inline-block mt-2 bg-white/20 text-xs px-3 py-1 rounded-full">{user?.role}</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {[
          { icon: User, label: 'Edit Profile', action: () => {} },
          { icon: Bell, label: 'Notifications', action: () => {} },
          { icon: Shield, label: 'Security', action: () => {} },
        ].map(({ icon: Icon, label, action }) => (
          <button key={label} onClick={action}
            className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition border-b border-gray-50 last:border-0">
            <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center">
              <Icon size={18} className="text-violet-600" />
            </div>
            <span className="flex-1 text-left font-medium text-gray-800">{label}</span>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        ))}
      </div>

      <button onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-semibold py-4 rounded-2xl hover:bg-red-100 transition">
        <LogOut size={18} />
        Sign Out
      </button>
    </div>
  );
}
