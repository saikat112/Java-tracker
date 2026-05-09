'use client';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { LogOut, ChevronRight, User, Bell, Shield, HelpCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const menu = [
    { icon: User,        label: 'Edit Profile',    sub: 'Update your info',       color: '#7C3AED', bg: '#F5F3FF' },
    { icon: Bell,        label: 'Notifications',   sub: 'Manage alerts',          color: '#2563EB', bg: '#EFF6FF' },
    { icon: Shield,      label: 'Security',        sub: 'Password & privacy',     color: '#059669', bg: '#ECFDF5' },
    { icon: HelpCircle,  label: 'Help & Support',  sub: 'FAQs and contact',       color: '#D97706', bg: '#FFFBEB' },
  ];

  return (
    <div className="space-y-4 fade-in">
      <h1 className="text-[26px] font-bold text-gray-900">Profile</h1>

      {/* Profile hero */}
      <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">{initials}</span>
          </div>
          <div>
            <h2 className="text-white text-xl font-bold">{user?.name}</h2>
            <p className="text-gray-400 text-sm mt-0.5">{user?.email}</p>
            <span className="inline-block mt-2 bg-violet-500/20 text-violet-300 text-xs px-3 py-1 rounded-full font-medium">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { emoji: '💸', label: 'Expenses', val: '—' },
          { emoji: '👥', label: 'Groups',   val: '—' },
          { emoji: '💰', label: 'Savings',  val: '—' },
        ].map(s => (
          <div key={s.label} className="card p-3 text-center">
            <span className="text-2xl">{s.emoji}</span>
            <p className="font-bold text-gray-900 text-sm mt-1">{s.val}</p>
            <p className="text-gray-400 text-[11px]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="card overflow-hidden divide-y divide-gray-50">
        {menu.map(({ icon: Icon, label, sub, color, bg }) => (
          <button key={label} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition tap">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-gray-900 text-sm">{label}</p>
              <p className="text-gray-400 text-xs">{sub}</p>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <button onClick={() => { logout(); router.push('/login'); }}
        className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-500 font-semibold py-4 rounded-2xl border border-red-100 tap hover:bg-red-100 transition">
        <LogOut size={18} /> Sign Out
      </button>

      <p className="text-center text-xs text-gray-300 pb-2">ExpenseTracker v1.0.0</p>
    </div>
  );
}
