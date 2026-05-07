'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Receipt, PlusCircle, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import AddExpenseModal from '@/components/expenses/AddExpenseModal';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/expenses', icon: Receipt, label: 'Expenses' },
  { href: '/groups', icon: Users, label: 'Groups' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-bottom z-50">
        <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 2).map((item) => (
            <NavItem key={item.href} {...item} active={pathname === item.href} />
          ))}
          <button onClick={() => setShowAdd(true)}
            className="flex flex-col items-center justify-center -mt-6 bg-violet-600 text-white rounded-full w-14 h-14 shadow-lg shadow-violet-300 active:scale-95 transition-transform">
            <PlusCircle size={28} />
          </button>
          {navItems.slice(2).map((item) => (
            <NavItem key={item.href} {...item} active={pathname === item.href} />
          ))}
        </div>
      </nav>
      {showAdd && <AddExpenseModal onClose={() => setShowAdd(false)} />}
    </>
  );
}

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: React.ElementType; label: string; active: boolean }) {
  return (
    <Link href={href} className={cn('flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors',
      active ? 'text-violet-600' : 'text-gray-400 hover:text-gray-600')}>
      <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
}
