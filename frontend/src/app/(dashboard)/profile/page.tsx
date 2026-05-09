'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { LogOut, ChevronRight, User, Bell, Shield, HelpCircle, Star } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    { icon: User, label: 'Edit Profile', color: 'bg-violet-100 text-violet-600', action: () => {} },
    { icon: Bell, label: 'Notifications', color: 'bg-blue-100 text-blue-600', action: () => {} },
    { icon: Shield, label: 'Security', color: 'bg-green-100 text-green-600', action: () => {} },
    { icon: Star, label: 'Rate App', color: 'bg-amber-100 text-amber-600', action: () => {} },
    { icon: HelpCircle, label: 'Help & Support', color: 'bg-gray-100 text-gray-600', action: () => {} },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <span className="text-2xl font-bold">{initials}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-violet-200 text-sm">{user?.email}</p>
            <span className="inline-block mt-1.5 bg-white/20 text-xs px-2.5 py-1 rounded-full font-medium">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Expenses', value: '0', emoji: '💸' },
          { label: 'Groups', value: '0', emoji: '👥' },
          { label: 'Savings', value: '₹0', emoji: '💰' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <span className="text-xl">{s.emoji}</span>
            <p className="font-bold text-gray-900 text-sm mt-1">{s.value}</p>
            <p className="text-gray-400 text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {menuItems.map(({ icon: Icon, label, color, action }, i) => (
          <button key={label} onClick={action}
            className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition ${i < menuItems.length - 1 ? 'border-b border-gray-50' : ''}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={17} />
            </div>
            <span className="flex-1 text-left font-medium text-gray-800 text-sm">{label}</span>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <button onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-500 font-semibold py-4 rounded-2xl hover:bg-red-100 transition active:scale-95 border border-red-100">
        <LogOut size={18} />
        Sign Out
      </button>

      <p className="text-center text-xs text-gray-300 pb-2">ExpenseTracker v1.0.0</p>
    </div>
  );
}
